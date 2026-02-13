/**
 * Serviço de Compras
 */

const { getDatabase } = require('../main');
const EstoqueService = require('./EstoqueService');

class CompraService {
  static async listar(filtros = {}) {
    try {
      const db = getDatabase();
      let sql = `
        SELECT c.*, f.razao_social as fornecedor_nome, u.nome as usuario_nome
        FROM compras c
        INNER JOIN fornecedores f ON c.fornecedor_id = f.id
        INNER JOIN usuarios u ON c.usuario_id = u.id
        WHERE 1=1
      `;
      const params = [];

      if (filtros.dataInicio) {
        sql += ` AND DATE(c.created_at) >= ?`;
        params.push(filtros.dataInicio);
      }

      if (filtros.dataFim) {
        sql += ` AND DATE(c.created_at) <= ?`;
        params.push(filtros.dataFim);
      }

      sql += ` ORDER BY c.created_at DESC LIMIT 100`;

      return await db.all(sql, params);
    } catch (error) {
      console.error('❌ Erro ao listar compras:', error);
      throw error;
    }
  }

  static async obter(id) {
    try {
      const db = getDatabase();
      
      const compra = await db.get(`
        SELECT c.*, f.razao_social as fornecedor_nome
        FROM compras c
        INNER JOIN fornecedores f ON c.fornecedor_id = f.id
        WHERE c.id = ?
      `, [id]);

      if (!compra) {
        throw new Error('Compra não encontrada');
      }

      compra.itens = await db.all(`
        SELECT ci.*, p.nome as produto_nome
        FROM compras_itens ci
        INNER JOIN produtos p ON ci.produto_id = p.id
        WHERE ci.compra_id = ?
      `, [id]);

      return compra;
    } catch (error) {
      console.error('❌ Erro ao obter compra:', error);
      throw error;
    }
  }

  static async criar(dados) {
    const db = getDatabase();
    
    try {
      await db.beginTransaction();

      const ultimaCompra = await db.get('SELECT MAX(numero) as ultimo FROM compras');
      const numeroCompra = (ultimaCompra.ultimo || 0) + 1;

      let subtotal = 0;
      dados.itens.forEach(item => {
        item.total = item.quantidade * item.preco_unitario;
        subtotal += item.total;
      });

      const total = subtotal - (dados.desconto || 0) + (dados.frete || 0) + (dados.outras_despesas || 0);

      const result = await db.run(`
        INSERT INTO compras (
          numero, fornecedor_id, usuario_id, status,
          subtotal, desconto, frete, outras_despesas, total, observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        numeroCompra,
        dados.fornecedor_id,
        dados.usuario_id,
        'CONCLUIDA',
        subtotal,
        dados.desconto || 0,
        dados.frete || 0,
        dados.outras_despesas || 0,
        total,
        dados.observacoes || null
      ]);

      const compraId = result.lastID;

      for (const item of dados.itens) {
        await db.run(`
          INSERT INTO compras_itens (
            compra_id, produto_id, quantidade, preco_unitario, total
          ) VALUES (?, ?, ?, ?, ?)
        `, [compraId, item.produto_id, item.quantidade, item.preco_unitario, item.total]);

        await EstoqueService.darEntrada(
          item.produto_id,
          item.quantidade,
          `COMPRA-${numeroCompra}`,
          dados.usuario_id
        );
      }

      await db.commit();
      return await this.obter(compraId);
    } catch (error) {
      await db.rollback();
      console.error('❌ Erro ao criar compra:', error);
      throw error;
    }
  }

  static async cancelar(id, motivo, usuarioId) {
    const db = getDatabase();
    
    try {
      await db.beginTransaction();

      const compra = await this.obter(id);

      if (compra.status === 'CANCELADA') {
        throw new Error('Compra já está cancelada');
      }

      await db.run(`
        UPDATE compras
        SET status = 'CANCELADA',
            observacoes = COALESCE(observacoes || ' | ', '') || ?
        WHERE id = ?
      `, [`Cancelada: ${motivo}`, id]);

      for (const item of compra.itens) {
        await EstoqueService.darBaixa(
          item.produto_id,
          item.quantidade,
          `CANCELAMENTO-COMPRA-${compra.numero}`,
          usuarioId
        );
      }

      await db.commit();
      return await this.obter(id);
    } catch (error) {
      await db.rollback();
      console.error('❌ Erro ao cancelar compra:', error);
      throw error;
    }
  }
}

module.exports = CompraService;

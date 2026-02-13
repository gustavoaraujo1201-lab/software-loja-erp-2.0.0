/**
 * Serviço de Vendas
 * Gerencia operações de vendas
 */

const { getDatabase } = require('../main');
const EstoqueService = require('./EstoqueService');

class VendaService {
  /**
   * Lista vendas
   */
  static async listar(filtros = {}) {
    try {
      const db = getDatabase();
      let sql = `
        SELECT v.*, c.nome as cliente_nome, u.nome as usuario_nome
        FROM vendas v
        LEFT JOIN clientes c ON v.cliente_id = c.id
        INNER JOIN usuarios u ON v.usuario_id = u.id
        WHERE 1=1
      `;
      const params = [];

      if (filtros.dataInicio) {
        sql += ` AND DATE(v.created_at) >= ?`;
        params.push(filtros.dataInicio);
      }

      if (filtros.dataFim) {
        sql += ` AND DATE(v.created_at) <= ?`;
        params.push(filtros.dataFim);
      }

      if (filtros.clienteId) {
        sql += ` AND v.cliente_id = ?`;
        params.push(filtros.clienteId);
      }

      if (filtros.status) {
        sql += ` AND v.status = ?`;
        params.push(filtros.status);
      }

      sql += ` ORDER BY v.created_at DESC LIMIT 100`;

      const vendas = await db.all(sql, params);
      return vendas;
    } catch (error) {
      console.error('❌ Erro ao listar vendas:', error);
      throw error;
    }
  }

  /**
   * Obtém uma venda com seus itens
   */
  static async obter(id) {
    try {
      const db = getDatabase();
      
      const venda = await db.get(`
        SELECT v.*, c.nome as cliente_nome, u.nome as usuario_nome
        FROM vendas v
        LEFT JOIN clientes c ON v.cliente_id = c.id
        INNER JOIN usuarios u ON v.usuario_id = u.id
        WHERE v.id = ?
      `, [id]);

      if (!venda) {
        throw new Error('Venda não encontrada');
      }

      // Buscar itens da venda
      venda.itens = await db.all(`
        SELECT vi.*, p.nome as produto_nome, p.codigo_barras
        FROM vendas_itens vi
        INNER JOIN produtos p ON vi.produto_id = p.id
        WHERE vi.venda_id = ?
      `, [id]);

      return venda;
    } catch (error) {
      console.error('❌ Erro ao obter venda:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova venda
   */
  static async criar(dados) {
    const db = getDatabase();
    
    try {
      await db.beginTransaction();

      // Gerar número da venda
      const ultimaVenda = await db.get('SELECT MAX(numero) as ultimo FROM vendas');
      const numeroVenda = (ultimaVenda.ultimo || 0) + 1;

      // Calcular totais
      let subtotal = 0;
      dados.itens.forEach(item => {
        item.total = (item.quantidade * item.preco_unitario) - (item.desconto || 0);
        subtotal += item.total;
      });

      const total = subtotal - (dados.desconto || 0);

      // Inserir venda
      const result = await db.run(`
        INSERT INTO vendas (
          numero, cliente_id, usuario_id, tipo, status,
          subtotal, desconto, total, forma_pagamento, observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        numeroVenda,
        dados.cliente_id || null,
        dados.usuario_id,
        dados.tipo || 'VENDA',
        'CONCLUIDA',
        subtotal,
        dados.desconto || 0,
        total,
        dados.forma_pagamento || null,
        dados.observacoes || null
      ]);

      const vendaId = result.lastID;

      // Inserir itens e dar baixa no estoque
      for (const item of dados.itens) {
        await db.run(`
          INSERT INTO vendas_itens (
            venda_id, produto_id, quantidade, preco_unitario, desconto, total
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          vendaId,
          item.produto_id,
          item.quantidade,
          item.preco_unitario,
          item.desconto || 0,
          item.total
        ]);

        // Dar baixa no estoque
        await EstoqueService.darBaixa(
          item.produto_id,
          item.quantidade,
          `VENDA-${numeroVenda}`,
          dados.usuario_id
        );
      }

      // Se forma de pagamento for à prazo, criar conta a receber
      if (dados.forma_pagamento === 'PRAZO' && dados.contas_receber) {
        for (const conta of dados.contas_receber) {
          await db.run(`
            INSERT INTO financeiro_contas (
              tipo, descricao, valor, data_vencimento, status,
              pessoa_id, pessoa_tipo
            ) VALUES ('RECEITA', ?, ?, ?, 'PENDENTE', ?, 'CLIENTE')
          `, [
            `Venda ${numeroVenda} - Parcela ${conta.parcela}`,
            conta.valor,
            conta.data_vencimento,
            dados.cliente_id
          ]);
        }
      }

      await db.commit();

      return await this.obter(vendaId);
    } catch (error) {
      await db.rollback();
      console.error('❌ Erro ao criar venda:', error);
      throw error;
    }
  }

  /**
   * Cancela uma venda
   */
  static async cancelar(id, motivo, usuarioId) {
    const db = getDatabase();
    
    try {
      await db.beginTransaction();

      const venda = await this.obter(id);

      if (venda.status === 'CANCELADA') {
        throw new Error('Venda já está cancelada');
      }

      // Atualizar status da venda
      await db.run(`
        UPDATE vendas
        SET status = 'CANCELADA',
            observacoes = COALESCE(observacoes || ' | ', '') || ?
        WHERE id = ?
      `, [`Cancelada: ${motivo}`, id]);

      // Devolver itens ao estoque
      for (const item of venda.itens) {
        await EstoqueService.darEntrada(
          item.produto_id,
          item.quantidade,
          `CANCELAMENTO-VENDA-${venda.numero}`,
          usuarioId
        );
      }

      // Cancelar contas a receber pendentes
      await db.run(`
        UPDATE financeiro_contas
        SET status = 'CANCELADA'
        WHERE pessoa_id = ? AND pessoa_tipo = 'CLIENTE'
          AND status = 'PENDENTE'
          AND descricao LIKE ?
      `, [venda.cliente_id, `%Venda ${venda.numero}%`]);

      await db.commit();

      return await this.obter(id);
    } catch (error) {
      await db.rollback();
      console.error('❌ Erro ao cancelar venda:', error);
      throw error;
    }
  }
}

module.exports = VendaService;

/**
 * Serviço de Estoque
 * Gerencia controle e movimentações de estoque
 */

const { getDatabase } = require('../main');

class EstoqueService {
  /**
   * Lista estoque de produtos
   */
  static async listar(filtros = {}) {
    try {
      const db = getDatabase();
      let sql = `
        SELECT e.*, p.nome as produto_nome, p.codigo_barras, p.unidade,
               p.estoque_minimo, p.estoque_maximo
        FROM estoque e
        INNER JOIN produtos p ON e.produto_id = p.id
        WHERE p.ativo = 1
      `;
      const params = [];

      if (filtros.busca) {
        sql += ` AND (p.nome LIKE ? OR p.codigo_barras LIKE ?)`;
        const termo = `%${filtros.busca}%`;
        params.push(termo, termo);
      }

      if (filtros.abaixo_minimo) {
        sql += ` AND e.quantidade < p.estoque_minimo`;
      }

      sql += ` ORDER BY p.nome ASC`;

      const estoque = await db.all(sql, params);
      return estoque;
    } catch (error) {
      console.error('❌ Erro ao listar estoque:', error);
      throw error;
    }
  }

  /**
   * Obtém estoque de um produto
   */
  static async obter(produtoId) {
    try {
      const db = getDatabase();
      const estoque = await db.get(`
        SELECT e.*, p.nome as produto_nome, p.codigo_barras
        FROM estoque e
        INNER JOIN produtos p ON e.produto_id = p.id
        WHERE e.produto_id = ?
      `, [produtoId]);

      if (!estoque) {
        throw new Error('Estoque não encontrado');
      }

      return estoque;
    } catch (error) {
      console.error('❌ Erro ao obter estoque:', error);
      throw error;
    }
  }

  /**
   * Ajusta quantidade de estoque
   */
  static async ajustar(produtoId, quantidade, motivo, usuarioId = null) {
    try {
      const db = getDatabase();

      // Obter estoque atual
      const estoque = await this.obter(produtoId);

      // Calcular nova quantidade
      const novaQuantidade = parseFloat(estoque.quantidade) + parseFloat(quantidade);
      
      if (novaQuantidade < 0) {
        throw new Error('Quantidade em estoque insuficiente');
      }

      // Atualizar estoque
      await db.run(`
        UPDATE estoque
        SET quantidade = ?,
            disponivel = ? - reservado,
            updated_at = CURRENT_TIMESTAMP
        WHERE produto_id = ?
      `, [novaQuantidade, novaQuantidade, produtoId]);

      // Registrar movimentação
      await this.registrarMovimentacao(
        produtoId,
        quantidade > 0 ? 'ENTRADA' : 'SAIDA',
        Math.abs(quantidade),
        motivo,
        null,
        usuarioId
      );

      return await this.obter(produtoId);
    } catch (error) {
      console.error('❌ Erro ao ajustar estoque:', error);
      throw error;
    }
  }

  /**
   * Registra movimentação de estoque
   */
  static async registrarMovimentacao(produtoId, tipo, quantidade, motivo, documento = null, usuarioId = null) {
    try {
      const db = getDatabase();
      
      await db.run(`
        INSERT INTO estoque_movimentacao (
          produto_id, tipo, quantidade, motivo, documento, usuario_id
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [produtoId, tipo, quantidade, motivo, documento, usuarioId]);

      return { sucesso: true };
    } catch (error) {
      console.error('❌ Erro ao registrar movimentação:', error);
      throw error;
    }
  }

  /**
   * Lista movimentações de um produto
   */
  static async movimentacoes(produtoId, filtros = {}) {
    try {
      const db = getDatabase();
      let sql = `
        SELECT m.*, p.nome as produto_nome, u.nome as usuario_nome
        FROM estoque_movimentacao m
        INNER JOIN produtos p ON m.produto_id = p.id
        LEFT JOIN usuarios u ON m.usuario_id = u.id
        WHERE m.produto_id = ?
      `;
      const params = [produtoId];

      if (filtros.dataInicio) {
        sql += ` AND DATE(m.created_at) >= ?`;
        params.push(filtros.dataInicio);
      }

      if (filtros.dataFim) {
        sql += ` AND DATE(m.created_at) <= ?`;
        params.push(filtros.dataFim);
      }

      sql += ` ORDER BY m.created_at DESC LIMIT 100`;

      const movimentacoes = await db.all(sql, params);
      return movimentacoes;
    } catch (error) {
      console.error('❌ Erro ao listar movimentações:', error);
      throw error;
    }
  }

  /**
   * Dar baixa no estoque (usado em vendas)
   */
  static async darBaixa(produtoId, quantidade, documento, usuarioId = null) {
    try {
      return await this.ajustar(
        produtoId,
        -quantidade,
        'VENDA',
        usuarioId
      );
    } catch (error) {
      console.error('❌ Erro ao dar baixa no estoque:', error);
      throw error;
    }
  }

  /**
   * Dar entrada no estoque (usado em compras)
   */
  static async darEntrada(produtoId, quantidade, documento, usuarioId = null) {
    try {
      return await this.ajustar(
        produtoId,
        quantidade,
        'COMPRA',
        usuarioId
      );
    } catch (error) {
      console.error('❌ Erro ao dar entrada no estoque:', error);
      throw error;
    }
  }
}

module.exports = EstoqueService;

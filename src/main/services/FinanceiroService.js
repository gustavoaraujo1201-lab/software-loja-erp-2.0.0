/**
 * Serviço de Financeiro
 * Gerencia contas a pagar e receber
 */

const { getDatabase } = require('../main');

class FinanceiroService {
  static async listarContas(filtros = {}) {
    const db = getDatabase();
    let sql = 'SELECT * FROM financeiro_contas WHERE 1=1';
    const params = [];

    if (filtros.tipo) {
      sql += ' AND tipo = ?';
      params.push(filtros.tipo);
    }

    if (filtros.status) {
      sql += ' AND status = ?';
      params.push(filtros.status);
    }

    sql += ' ORDER BY data_vencimento ASC';

    return await db.all(sql, params);
  }

  static async obterConta(id) {
    const db = getDatabase();
    return await db.get('SELECT * FROM financeiro_contas WHERE id = ?', [id]);
  }

  static async criarConta(dados) {
    const db = getDatabase();
    const result = await db.run(`
      INSERT INTO financeiro_contas (
        tipo, categoria_id, descricao, valor, data_vencimento,
        pessoa_id, pessoa_tipo, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      dados.tipo,
      dados.categoria_id || null,
      dados.descricao,
      dados.valor,
      dados.data_vencimento,
      dados.pessoa_id || null,
      dados.pessoa_tipo || null,
      dados.observacoes || null
    ]);

    return await this.obterConta(result.lastID);
  }

  static async baixarConta(id, dados) {
    const db = getDatabase();
    await db.run(`
      UPDATE financeiro_contas
      SET status = 'PAGA',
          data_pagamento = ?,
          valor_pago = ?
      WHERE id = ?
    `, [dados.data_pagamento, dados.valor_pago, id]);

    return await this.obterConta(id);
  }

  static async fluxoCaixa(dataInicio, dataFim) {
    const db = getDatabase();
    
    const receitas = await db.get(`
      SELECT COALESCE(SUM(valor_pago), 0) as total
      FROM financeiro_contas
      WHERE tipo = 'RECEITA' AND status = 'PAGA'
        AND DATE(data_pagamento) BETWEEN ? AND ?
    `, [dataInicio, dataFim]);

    const despesas = await db.get(`
      SELECT COALESCE(SUM(valor_pago), 0) as total
      FROM financeiro_contas
      WHERE tipo = 'DESPESA' AND status = 'PAGA'
        AND DATE(data_pagamento) BETWEEN ? AND ?
    `, [dataInicio, dataFim]);

    return {
      receitas: receitas.total,
      despesas: despesas.total,
      saldo: receitas.total - despesas.total
    };
  }
}

module.exports = FinanceiroService;

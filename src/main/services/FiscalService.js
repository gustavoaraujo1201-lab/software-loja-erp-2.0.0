/**
 * Serviço Fiscal - NF-e
 */
const { getDatabase } = require('../main');

class FiscalService {
  static async listarNFe(filtros = {}) {
    const db = getDatabase();
    return await db.all('SELECT * FROM nfe ORDER BY created_at DESC LIMIT 100');
  }

  static async obterNFe(id) {
    const db = getDatabase();
    return await db.get('SELECT * FROM nfe WHERE id = ?', [id]);
  }

  static async emitirNFe(dados) {
    const db = getDatabase();
    const ultimaNFe = await db.get('SELECT MAX(numero) as ultimo FROM nfe');
    const numero = (ultimaNFe.ultimo || 0) + 1;

    const result = await db.run(`
      INSERT INTO nfe (numero, serie, tipo, venda_id, cliente_id, valor, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [numero, dados.serie || '1', dados.tipo || 'SAIDA', dados.venda_id, dados.cliente_id, dados.valor, 'PENDENTE']);

    return await this.obterNFe(result.lastID);
  }
}

module.exports = FiscalService;

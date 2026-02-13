/**
 * Configuração e gerenciamento do banco de dados SQLite
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DatabaseWrapper {
  constructor() {
    // Caminho do banco de dados
    const dbDir = path.join(__dirname, '../../../data');
    
    // Criar diretório data se não existir
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.dbPath = path.join(dbDir, 'database.db');
    this.db = null;
  }

  /**
   * Inicializa a conexão com o banco de dados
   */
  initialize() {
    try {
      this.db = new Database(this.dbPath);
      console.log('✅ Conexão com banco de dados estabelecida');
      
      // Habilitar foreign keys
      this.db.pragma('foreign_keys = ON');
      
      return Promise.resolve();
    } catch (err) {
      console.error('❌ Erro ao conectar ao banco de dados:', err);
      return Promise.reject(err);
    }
  }

  /**
   * Executa uma query SQL
   * @param {string} sql - Query SQL
   * @param {Array} params - Parâmetros da query
   */
  run(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.run(params);
      return Promise.resolve({ lastID: result.lastInsertRowid, changes: result.changes });
    } catch (err) {
      console.error('❌ Erro ao executar query:', err);
      console.error('SQL:', sql);
      return Promise.reject(err);
    }
  }

  /**
   * Busca uma única linha
   * @param {string} sql - Query SQL
   * @param {Array} params - Parâmetros da query
   */
  get(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      const row = stmt.get(params);
      return Promise.resolve(row);
    } catch (err) {
      console.error('❌ Erro ao buscar dados:', err);
      return Promise.reject(err);
    }
  }

  /**
   * Busca todas as linhas
   * @param {string} sql - Query SQL
   * @param {Array} params - Parâmetros da query
   */
  all(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      const rows = stmt.all(params);
      return Promise.resolve(rows);
    } catch (err) {
      console.error('❌ Erro ao buscar dados:', err);
      return Promise.reject(err);
    }
  }

  /**
   * Inicia uma transação
   */
  async beginTransaction() {
    return this.run('BEGIN TRANSACTION');
  }

  /**
   * Confirma uma transação
   */
  async commit() {
    return this.run('COMMIT');
  }

  /**
   * Reverte uma transação
   */
  async rollback() {
    return this.run('ROLLBACK');
  }

  /**
   * Fecha a conexão com o banco de dados
   */
  close() {
    try {
      if (this.db) {
        this.db.close();
        console.log('✅ Conexão com banco de dados fechada');
      }
      return Promise.resolve();
    } catch (err) {
      console.error('❌ Erro ao fechar banco de dados:', err);
      return Promise.reject(err);
    }
  }
}

module.exports = DatabaseWrapper;

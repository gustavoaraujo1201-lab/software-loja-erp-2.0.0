/**
 * Configuração e gerenciamento do banco de dados SQLite
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
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
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ Erro ao conectar ao banco de dados:', err);
          reject(err);
        } else {
          console.log('✅ Conexão com banco de dados estabelecida');
          // Habilitar foreign keys
          this.db.run('PRAGMA foreign_keys = ON');
          resolve();
        }
      });
    });
  }

  /**
   * Executa uma query SQL
   * @param {string} sql - Query SQL
   * @param {Array} params - Parâmetros da query
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('❌ Erro ao executar query:', err);
          console.error('SQL:', sql);
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  /**
   * Busca uma única linha
   * @param {string} sql - Query SQL
   * @param {Array} params - Parâmetros da query
   */
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          console.error('❌ Erro ao buscar dados:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Busca todas as linhas
   * @param {string} sql - Query SQL
   * @param {Array} params - Parâmetros da query
   */
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('❌ Erro ao buscar dados:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
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
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('❌ Erro ao fechar banco de dados:', err);
            reject(err);
          } else {
            console.log('✅ Conexão com banco de dados fechada');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Database;

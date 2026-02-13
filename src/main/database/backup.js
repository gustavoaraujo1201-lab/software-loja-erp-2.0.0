/**
 * Sistema de Backup Automático do Banco de Dados
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const copyFile = promisify(fs.copyFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

class BackupService {
  constructor(db) {
    this.db = db;
    this.backupDir = path.join(__dirname, '../../../data/backups');
    this.dbPath = path.join(__dirname, '../../../data/database.db');
    
    // Garantir que o diretório de backups existe
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Cria um backup do banco de dados
   * @param {string} tipo - Tipo do backup (MANUAL, AUTOMATICO)
   */
  async criarBackup(tipo = 'MANUAL') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const nomeArquivo = `backup-${timestamp}.db`;
      const caminhoBackup = path.join(this.backupDir, nomeArquivo);

      // Copiar arquivo do banco de dados
      await copyFile(this.dbPath, caminhoBackup);

      // Obter tamanho do arquivo
      const stats = await stat(caminhoBackup);
      const tamanho = stats.size;

      // Registrar backup no banco
      await this.db.run(`
        INSERT INTO backups (nome_arquivo, tamanho, tipo, status)
        VALUES (?, ?, ?, 'SUCESSO')
      `, [nomeArquivo, tamanho, tipo]);

      console.log(`✅ Backup criado com sucesso: ${nomeArquivo}`);

      // Limpar backups antigos (manter apenas os últimos 30)
      await this.limparBackupsAntigos();

      return {
        sucesso: true,
        arquivo: nomeArquivo,
        tamanho: tamanho
      };
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error);
      
      // Registrar falha no banco
      try {
        await this.db.run(`
          INSERT INTO backups (nome_arquivo, tipo, status)
          VALUES ('ERRO', ?, 'FALHA')
        `, [tipo]);
      } catch (e) {
        console.error('❌ Erro ao registrar falha do backup:', e);
      }

      throw error;
    }
  }

  /**
   * Lista todos os backups disponíveis
   */
  async listarBackups() {
    try {
      const backups = await this.db.all(`
        SELECT * FROM backups
        ORDER BY created_at DESC
        LIMIT 50
      `);

      return backups;
    } catch (error) {
      console.error('❌ Erro ao listar backups:', error);
      throw error;
    }
  }

  /**
   * Restaura um backup
   * @param {string} nomeArquivo - Nome do arquivo de backup
   */
  async restaurarBackup(nomeArquivo) {
    try {
      const caminhoBackup = path.join(this.backupDir, nomeArquivo);

      // Verificar se o arquivo existe
      if (!fs.existsSync(caminhoBackup)) {
        throw new Error('Arquivo de backup não encontrado');
      }

      // Fechar conexão atual com o banco
      await this.db.close();

      // Criar backup do banco atual antes de restaurar
      const backupAtual = `backup-pre-restore-${Date.now()}.db`;
      await copyFile(this.dbPath, path.join(this.backupDir, backupAtual));

      // Restaurar o backup
      await copyFile(caminhoBackup, this.dbPath);

      console.log(`✅ Backup restaurado com sucesso: ${nomeArquivo}`);

      return {
        sucesso: true,
        mensagem: 'Backup restaurado com sucesso. O sistema será reiniciado.'
      };
    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error);
      throw error;
    }
  }

  /**
   * Remove backups antigos, mantendo apenas os últimos 30
   */
  async limparBackupsAntigos() {
    try {
      const arquivos = await readdir(this.backupDir);
      const backups = [];

      // Obter informações de todos os backups
      for (const arquivo of arquivos) {
        if (arquivo.endsWith('.db')) {
          const caminho = path.join(this.backupDir, arquivo);
          const stats = await stat(caminho);
          backups.push({
            nome: arquivo,
            caminho: caminho,
            data: stats.mtime
          });
        }
      }

      // Ordenar por data (mais recente primeiro)
      backups.sort((a, b) => b.data - a.data);

      // Manter apenas os 30 mais recentes
      const backupsParaRemover = backups.slice(30);

      for (const backup of backupsParaRemover) {
        await unlink(backup.caminho);
        console.log(`🗑️ Backup antigo removido: ${backup.nome}`);
      }

      if (backupsParaRemover.length > 0) {
        console.log(`✅ ${backupsParaRemover.length} backups antigos removidos`);
      }
    } catch (error) {
      console.error('❌ Erro ao limpar backups antigos:', error);
    }
  }

  /**
   * Agenda backup automático diário
   */
  agendarBackupAutomatico() {
    const cron = require('node-cron');

    // Executar backup todo dia às 2h da manhã
    cron.schedule('0 2 * * *', async () => {
      console.log('🔄 Executando backup automático...');
      try {
        await this.criarBackup('AUTOMATICO');
        console.log('✅ Backup automático concluído');
      } catch (error) {
        console.error('❌ Erro no backup automático:', error);
      }
    });

    console.log('✅ Backup automático agendado para 2h da manhã');
  }
}

module.exports = BackupService;

/**
 * Main Process do Electron
 * Responsável por gerenciar a aplicação desktop
 */

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./database/db');
const { initializeMigrations } = require('./database/migrations');

// Importar handlers
require('./handlers/produtos');
require('./handlers/vendas');
require('./handlers/compras');
require('./handlers/estoque');
require('./handlers/financeiro');
require('./handlers/fiscal');
require('./handlers/ecommerce');
require('./handlers/ferramentas');

let mainWindow;
let db;

/**
 * Cria a janela principal da aplicação
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, '../../assets/icon.png')
  });

  // Carregar tela de login
  mainWindow.loadFile(path.join(__dirname, '../renderer/login.html'));

  // Abrir DevTools em modo desenvolvimento
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Inicializa o banco de dados
 */
async function initializeDatabase() {
  try {
    db = new Database();
    await db.initialize();
    await initializeMigrations(db);
    console.log('✅ Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

/**
 * Handler para obter a janela principal
 */
ipcMain.handle('get-main-window', () => {
  return mainWindow;
});

/**
 * Handler para navegar entre páginas
 */
ipcMain.handle('navigate', (event, page) => {
  const pagePath = path.join(__dirname, `../renderer/${page}.html`);
  mainWindow.loadFile(pagePath);
});

/**
 * Handler para obter instância do banco de dados
 */
ipcMain.handle('get-database', () => {
  return db;
});

// Quando o Electron estiver pronto
app.whenReady().then(async () => {
  try {
    await initializeDatabase();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error);
    app.quit();
  }
});

// Fechar aplicação quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Exportar para uso nos handlers
module.exports = { getDatabase: () => db };

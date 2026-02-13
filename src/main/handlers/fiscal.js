/**
 * Handler IPC para Fiscal
 */
const { ipcMain } = require('electron');
const FiscalService = require('../services/FiscalService');

ipcMain.handle('fiscal:nfe:listar', async (event, filtros) => {
  return await FiscalService.listarNFe(filtros);
});

ipcMain.handle('fiscal:nfe:obter', async (event, id) => {
  return await FiscalService.obterNFe(id);
});

ipcMain.handle('fiscal:nfe:emitir', async (event, dados) => {
  return await FiscalService.emitirNFe(dados);
});

console.log('✅ Handler de Fiscal carregado');

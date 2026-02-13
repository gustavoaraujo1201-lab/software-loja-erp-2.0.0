/**
 * Handler IPC para Estoque
 */
const { ipcMain } = require('electron');
const EstoqueService = require('../services/EstoqueService');

ipcMain.handle('estoque:listar', async (event, filtros) => {
  return await EstoqueService.listar(filtros);
});

ipcMain.handle('estoque:obter', async (event, produtoId) => {
  return await EstoqueService.obter(produtoId);
});

ipcMain.handle('estoque:ajustar', async (event, produtoId, quantidade, motivo) => {
  return await EstoqueService.ajustar(produtoId, quantidade, motivo);
});

ipcMain.handle('estoque:movimentacoes', async (event, produtoId, filtros) => {
  return await EstoqueService.movimentacoes(produtoId, filtros);
});

console.log('✅ Handler de Estoque carregado');

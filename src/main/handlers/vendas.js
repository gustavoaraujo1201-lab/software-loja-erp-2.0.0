/**
 * Handler IPC para Vendas
 */
const { ipcMain } = require('electron');
const VendaService = require('../services/VendaService');

ipcMain.handle('vendas:listar', async (event, filtros) => {
  return await VendaService.listar(filtros);
});

ipcMain.handle('vendas:obter', async (event, id) => {
  return await VendaService.obter(id);
});

ipcMain.handle('vendas:criar', async (event, venda) => {
  return await VendaService.criar(venda);
});

ipcMain.handle('vendas:cancelar', async (event, id, motivo) => {
  return await VendaService.cancelar(id, motivo);
});

console.log('✅ Handler de Vendas carregado');

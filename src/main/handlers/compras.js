/**
 * Handler IPC para Compras
 */
const { ipcMain } = require('electron');
const CompraService = require('../services/CompraService');

ipcMain.handle('compras:listar', async (event, filtros) => {
  return await CompraService.listar(filtros);
});

ipcMain.handle('compras:obter', async (event, id) => {
  return await CompraService.obter(id);
});

ipcMain.handle('compras:criar', async (event, compra) => {
  return await CompraService.criar(compra);
});

ipcMain.handle('compras:cancelar', async (event, id, motivo) => {
  return await CompraService.cancelar(id, motivo);
});

console.log('✅ Handler de Compras carregado');

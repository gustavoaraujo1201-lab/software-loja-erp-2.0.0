/**
 * Handler IPC para E-commerce
 */
const { ipcMain } = require('electron');
const EcommerceService = require('../services/EcommerceService');

ipcMain.handle('ecommerce:sincronizar', async (event, tipo) => {
  return await EcommerceService.sincronizarProdutos();
});

ipcMain.handle('ecommerce:status', async (event) => {
  return await EcommerceService.obterStatus();
});

ipcMain.handle('ecommerce:pedidos', async (event, filtros) => {
  return await EcommerceService.listarPedidos(filtros);
});

ipcMain.handle('ecommerce:importar-pedido', async (event, pedidoId) => {
  return await EcommerceService.importarPedido(pedidoId);
});

console.log('✅ Handler de E-commerce carregado');

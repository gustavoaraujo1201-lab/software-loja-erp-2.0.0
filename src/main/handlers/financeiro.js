/**
 * Handler IPC para Financeiro
 */
const { ipcMain } = require('electron');
const FinanceiroService = require('../services/FinanceiroService');

ipcMain.handle('financeiro:contas:listar', async (event, filtros) => {
  return await FinanceiroService.listarContas(filtros);
});

ipcMain.handle('financeiro:contas:obter', async (event, id) => {
  return await FinanceiroService.obterConta(id);
});

ipcMain.handle('financeiro:contas:criar', async (event, conta) => {
  return await FinanceiroService.criarConta(conta);
});

ipcMain.handle('financeiro:contas:baixar', async (event, id, dados) => {
  return await FinanceiroService.baixarConta(id, dados);
});

ipcMain.handle('financeiro:fluxo-caixa', async (event, dataInicio, dataFim) => {
  return await FinanceiroService.fluxoCaixa(dataInicio, dataFim);
});

console.log('✅ Handler de Financeiro carregado');

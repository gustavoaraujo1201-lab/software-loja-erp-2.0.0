/**
 * Handler IPC para Produtos
 */

const { ipcMain } = require('electron');
const ProdutoService = require('../services/ProdutoService');

// Listar produtos
ipcMain.handle('produtos:listar', async (event, filtros) => {
  try {
    return await ProdutoService.listar(filtros);
  } catch (error) {
    console.error('Erro no handler produtos:listar:', error);
    throw error;
  }
});

// Obter produto
ipcMain.handle('produtos:obter', async (event, id) => {
  try {
    return await ProdutoService.obter(id);
  } catch (error) {
    console.error('Erro no handler produtos:obter:', error);
    throw error;
  }
});

// Buscar por código de barras
ipcMain.handle('produtos:buscar-codigo-barras', async (event, codigo) => {
  try {
    return await ProdutoService.buscarPorCodigoBarras(codigo);
  } catch (error) {
    console.error('Erro no handler produtos:buscar-codigo-barras:', error);
    throw error;
  }
});

// Criar produto
ipcMain.handle('produtos:criar', async (event, produto) => {
  try {
    return await ProdutoService.criar(produto);
  } catch (error) {
    console.error('Erro no handler produtos:criar:', error);
    throw error;
  }
});

// Atualizar produto
ipcMain.handle('produtos:atualizar', async (event, id, produto) => {
  try {
    return await ProdutoService.atualizar(id, produto);
  } catch (error) {
    console.error('Erro no handler produtos:atualizar:', error);
    throw error;
  }
});

// Deletar produto
ipcMain.handle('produtos:deletar', async (event, id) => {
  try {
    return await ProdutoService.deletar(id);
  } catch (error) {
    console.error('Erro no handler produtos:deletar:', error);
    throw error;
  }
});

console.log('✅ Handler de Produtos carregado');

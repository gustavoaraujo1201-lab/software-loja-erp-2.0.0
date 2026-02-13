/**
 * Handler IPC para Autenticação
 */
const { ipcMain } = require('electron');
const UsuarioService = require('../services/UsuarioService');

let usuarioLogado = null;

ipcMain.handle('auth:login', async (event, email, senha) => {
  try {
    usuarioLogado = await UsuarioService.autenticar(email, senha);
    return { sucesso: true, usuario: usuarioLogado };
  } catch (error) {
    return { sucesso: false, erro: error.message };
  }
});

ipcMain.handle('auth:logout', async (event) => {
  usuarioLogado = null;
  return { sucesso: true };
});

ipcMain.handle('auth:usuario-atual', async (event) => {
  return usuarioLogado;
});

// Handlers para clientes e fornecedores
const ClienteService = require('../services/ClienteService');
const FornecedorService = require('../services/FornecedorService');

ipcMain.handle('clientes:listar', async (event, filtros) => {
  return await ClienteService.listar(filtros);
});

ipcMain.handle('clientes:obter', async (event, id) => {
  return await ClienteService.obter(id);
});

ipcMain.handle('clientes:criar', async (event, cliente) => {
  return await ClienteService.criar(cliente);
});

ipcMain.handle('clientes:atualizar', async (event, id, cliente) => {
  return await ClienteService.atualizar(id, cliente);
});

ipcMain.handle('clientes:deletar', async (event, id) => {
  return await ClienteService.deletar(id);
});

ipcMain.handle('fornecedores:listar', async (event, filtros) => {
  return await FornecedorService.listar(filtros);
});

ipcMain.handle('fornecedores:obter', async (event, id) => {
  return await FornecedorService.obter(id);
});

ipcMain.handle('fornecedores:criar', async (event, fornecedor) => {
  return await FornecedorService.criar(fornecedor);
});

ipcMain.handle('fornecedores:atualizar', async (event, id, fornecedor) => {
  return await FornecedorService.atualizar(id, fornecedor);
});

ipcMain.handle('fornecedores:deletar', async (event, id) => {
  return await FornecedorService.deletar(id);
});

console.log('✅ Handler de Autenticação carregado');

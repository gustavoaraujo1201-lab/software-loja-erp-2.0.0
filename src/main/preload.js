/**
 * Preload Script
 * Ponte segura entre o processo principal e o renderer
 * Expõe APIs específicas para o frontend
 */

const { contextBridge, ipcRenderer } = require('electron');

/**
 * API exposta para o renderer process
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // Navegação
  navigate: (page) => ipcRenderer.invoke('navigate', page),

  // Produtos
  produtos: {
    listar: (filtros) => ipcRenderer.invoke('produtos:listar', filtros),
    obter: (id) => ipcRenderer.invoke('produtos:obter', id),
    criar: (produto) => ipcRenderer.invoke('produtos:criar', produto),
    atualizar: (id, produto) => ipcRenderer.invoke('produtos:atualizar', id, produto),
    deletar: (id) => ipcRenderer.invoke('produtos:deletar', id),
    buscarPorCodigoBarras: (codigo) => ipcRenderer.invoke('produtos:buscar-codigo-barras', codigo)
  },

  // Clientes
  clientes: {
    listar: (filtros) => ipcRenderer.invoke('clientes:listar', filtros),
    obter: (id) => ipcRenderer.invoke('clientes:obter', id),
    criar: (cliente) => ipcRenderer.invoke('clientes:criar', cliente),
    atualizar: (id, cliente) => ipcRenderer.invoke('clientes:atualizar', id, cliente),
    deletar: (id) => ipcRenderer.invoke('clientes:deletar', id)
  },

  // Fornecedores
  fornecedores: {
    listar: (filtros) => ipcRenderer.invoke('fornecedores:listar', filtros),
    obter: (id) => ipcRenderer.invoke('fornecedores:obter', id),
    criar: (fornecedor) => ipcRenderer.invoke('fornecedores:criar', fornecedor),
    atualizar: (id, fornecedor) => ipcRenderer.invoke('fornecedores:atualizar', id, fornecedor),
    deletar: (id) => ipcRenderer.invoke('fornecedores:deletar', id)
  },

  // Vendas
  vendas: {
    listar: (filtros) => ipcRenderer.invoke('vendas:listar', filtros),
    obter: (id) => ipcRenderer.invoke('vendas:obter', id),
    criar: (venda) => ipcRenderer.invoke('vendas:criar', venda),
    cancelar: (id, motivo) => ipcRenderer.invoke('vendas:cancelar', id, motivo)
  },

  // Compras
  compras: {
    listar: (filtros) => ipcRenderer.invoke('compras:listar', filtros),
    obter: (id) => ipcRenderer.invoke('compras:obter', id),
    criar: (compra) => ipcRenderer.invoke('compras:criar', compra),
    cancelar: (id, motivo) => ipcRenderer.invoke('compras:cancelar', id, motivo)
  },

  // Estoque
  estoque: {
    listar: (filtros) => ipcRenderer.invoke('estoque:listar', filtros),
    obter: (produtoId) => ipcRenderer.invoke('estoque:obter', produtoId),
    ajustar: (produtoId, quantidade, motivo) => ipcRenderer.invoke('estoque:ajustar', produtoId, quantidade, motivo),
    movimentacoes: (produtoId, filtros) => ipcRenderer.invoke('estoque:movimentacoes', produtoId, filtros)
  },

  // Financeiro
  financeiro: {
    contas: {
      listar: (filtros) => ipcRenderer.invoke('financeiro:contas:listar', filtros),
      obter: (id) => ipcRenderer.invoke('financeiro:contas:obter', id),
      criar: (conta) => ipcRenderer.invoke('financeiro:contas:criar', conta),
      atualizar: (id, conta) => ipcRenderer.invoke('financeiro:contas:atualizar', id, conta),
      baixar: (id, dados) => ipcRenderer.invoke('financeiro:contas:baixar', id, dados)
    },
    fluxoCaixa: (dataInicio, dataFim) => ipcRenderer.invoke('financeiro:fluxo-caixa', dataInicio, dataFim)
  },

  // Fiscal
  fiscal: {
    nfe: {
      listar: (filtros) => ipcRenderer.invoke('fiscal:nfe:listar', filtros),
      obter: (id) => ipcRenderer.invoke('fiscal:nfe:obter', id),
      emitir: (dados) => ipcRenderer.invoke('fiscal:nfe:emitir', dados),
      cancelar: (id, motivo) => ipcRenderer.invoke('fiscal:nfe:cancelar', id, motivo)
    }
  },

  // E-commerce
  ecommerce: {
    sincronizar: (tipo) => ipcRenderer.invoke('ecommerce:sincronizar', tipo),
    obterStatus: () => ipcRenderer.invoke('ecommerce:status'),
    pedidos: (filtros) => ipcRenderer.invoke('ecommerce:pedidos', filtros),
    importarPedido: (pedidoId) => ipcRenderer.invoke('ecommerce:importar-pedido', pedidoId)
  },

  // Ferramentas
  ferramentas: {
    importar: (tipo, arquivo) => ipcRenderer.invoke('ferramentas:importar', tipo, arquivo),
    exportar: (tipo, filtros) => ipcRenderer.invoke('ferramentas:exportar', tipo, filtros),
    enviarEmail: (destinatario, assunto, mensagem, anexos) => ipcRenderer.invoke('ferramentas:email', destinatario, assunto, mensagem, anexos),
    backup: {
      criar: () => ipcRenderer.invoke('ferramentas:backup:criar'),
      restaurar: (arquivo) => ipcRenderer.invoke('ferramentas:backup:restaurar', arquivo),
      listar: () => ipcRenderer.invoke('ferramentas:backup:listar')
    },
    logs: {
      listar: (filtros) => ipcRenderer.invoke('ferramentas:logs:listar', filtros),
      exportar: (filtros) => ipcRenderer.invoke('ferramentas:logs:exportar', filtros)
    },
    etiquetas: {
      gerar: (produtos) => ipcRenderer.invoke('ferramentas:etiquetas:gerar', produtos)
    },
    tarefas: {
      listar: () => ipcRenderer.invoke('ferramentas:tarefas:listar'),
      criar: (tarefa) => ipcRenderer.invoke('ferramentas:tarefas:criar', tarefa),
      atualizar: (id, tarefa) => ipcRenderer.invoke('ferramentas:tarefas:atualizar', id, tarefa),
      deletar: (id) => ipcRenderer.invoke('ferramentas:tarefas:deletar', id)
    },
    lgpd: {
      consentimentos: (clienteId) => ipcRenderer.invoke('ferramentas:lgpd:consentimentos', clienteId),
      exportarDados: (clienteId) => ipcRenderer.invoke('ferramentas:lgpd:exportar', clienteId),
      excluirDados: (clienteId) => ipcRenderer.invoke('ferramentas:lgpd:excluir', clienteId)
    },
    xml: {
      importar: (arquivo) => ipcRenderer.invoke('ferramentas:xml:importar', arquivo)
    }
  },

  // Usuários/Autenticação
  auth: {
    login: (usuario, senha) => ipcRenderer.invoke('auth:login', usuario, senha),
    logout: () => ipcRenderer.invoke('auth:logout'),
    usuarioAtual: () => ipcRenderer.invoke('auth:usuario-atual')
  },

  // Relatórios
  relatorios: {
    gerar: (tipo, filtros) => ipcRenderer.invoke('relatorios:gerar', tipo, filtros)
  }
});

console.log('✅ Preload script carregado com sucesso');

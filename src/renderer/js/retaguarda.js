/**
 * JavaScript para a página de retaguarda
 * Gerencia navegação no menu e carregamento de páginas
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Carregar nome do usuário
  await carregarUsuario();

  // Configurar event listeners
  configurarMenu();
  configurarBusca();
  configurarLogout();
});

/**
 * Carrega informações do usuário logado
 */
async function carregarUsuario() {
  try {
    const usuario = await window.electronAPI.auth.usuarioAtual();
    
    if (usuario) {
      document.getElementById('usuario-nome').textContent = usuario.nome;
    } else {
      // Se não há usuário logado, voltar para login
      window.electronAPI.navigate('login');
    }
  } catch (error) {
    console.error('Erro ao carregar usuário:', error);
  }
}

/**
 * Configura navegação no menu
 */
function configurarMenu() {
  const menuLinks = document.querySelectorAll('.menu a');

  menuLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();

      // Remover classe active de todos os links
      menuLinks.forEach(l => l.classList.remove('active'));
      
      // Adicionar classe active ao link clicado
      link.classList.add('active');

      // Obter página ou ação
      const page = link.getAttribute('data-page');
      const action = link.getAttribute('data-action');

      if (page) {
        await carregarPagina(page);
      } else if (action === 'pdv') {
        // Abrir PDV em nova janela ou página
        window.electronAPI.navigate('pdv');
      }
    });
  });
}

/**
 * Carrega conteúdo de uma página
 */
async function carregarPagina(page) {
  const contentArea = document.getElementById('content-area');
  const contentHeader = document.querySelector('.content-header');

  // Atualizar cabeçalho
  const titulos = {
    'produtos': 'Cadastro de Produtos',
    'clientes': 'Cadastro de Clientes',
    'fornecedores': 'Cadastro de Fornecedores',
    'categorias': 'Cadastro de Categorias',
    'usuarios': 'Usuários do Sistema',
    'vendas': 'Registro de Vendas',
    'compras': 'Registro de Compras',
    'estoque': 'Consulta de Estoque',
    'estoque-movimentacoes': 'Movimentações de Estoque',
    'estoque-inventario': 'Inventário',
    'contas-pagar': 'Contas a Pagar',
    'contas-receber': 'Contas a Receber',
    'fluxo-caixa': 'Fluxo de Caixa',
    'nfe-emissao': 'Emissão de NF-e',
    'nfe-consulta': 'Consulta de NF-e',
    'ecommerce-sincronizacao': 'Sincronização E-commerce',
    'ecommerce-pedidos': 'Pedidos do E-commerce',
    'ecommerce-config': 'Configurações do E-commerce',
    'ferramentas-importacao': 'Importação de Dados',
    'ferramentas-exportacao': 'Exportação de Dados',
    'ferramentas-email': 'Envio de E-mail',
    'ferramentas-backup': 'Backup do Sistema',
    'ferramentas-logs': 'Logs de Eventos',
    'ferramentas-etiquetas': 'Impressão de Etiquetas',
    'ferramentas-tarefas': 'Tarefas Agendadas',
    'ferramentas-lgpd': 'LGPD - Gestão de Dados',
    'relatorios-vendas': 'Relatórios de Vendas',
    'relatorios-compras': 'Relatórios de Compras',
    'relatorios-estoque': 'Relatórios de Estoque',
    'relatorios-financeiro': 'Relatórios Financeiros'
  };

  const titulo = titulos[page] || 'Página';
  contentHeader.querySelector('h1').textContent = titulo;
  contentHeader.querySelector('p').textContent = `Gerencie ${titulo.toLowerCase()}`;

  // Mostrar loading
  contentArea.innerHTML = '<div class="loading">Carregando...</div>';

  try {
    // Verificar se existe página específica
    const response = await fetch(`pages/${page}.html`);
    
    if (response.ok) {
      const html = await response.text();
      contentArea.innerHTML = html;
      
      // Executar script da página se existir
      const script = contentArea.querySelector('script');
      if (script) {
        eval(script.textContent);
      }
    } else {
      // Página não encontrada, mostrar placeholder
      mostrarPlaceholder(page, titulo);
    }
  } catch (error) {
    console.error('Erro ao carregar página:', error);
    mostrarPlaceholder(page, titulo);
  }
}

/**
 * Mostra placeholder quando página não existe ainda
 */
function mostrarPlaceholder(page, titulo) {
  const contentArea = document.getElementById('content-area');
  
  contentArea.innerHTML = `
    <div class="card">
      <h2>🚧 ${titulo}</h2>
      <p>Esta funcionalidade está sendo desenvolvida.</p>
      <p>Em breve você poderá usar este módulo do sistema.</p>
      <br>
      <p><strong>Página:</strong> ${page}</p>
    </div>
  `;
}

/**
 * Configura busca no menu
 */
function configurarBusca() {
  const searchInput = document.getElementById('search-menu');
  const menuSections = document.querySelectorAll('.menu-section');

  searchInput.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();

    menuSections.forEach(section => {
      const links = section.querySelectorAll('a');
      let temResultado = false;

      links.forEach(link => {
        const texto = link.textContent.toLowerCase();
        
        if (texto.includes(termo)) {
          link.parentElement.style.display = 'block';
          temResultado = true;
        } else {
          link.parentElement.style.display = 'none';
        }
      });

      // Mostrar/ocultar seção inteira
      if (termo === '' || temResultado) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  });
}

/**
 * Configura botão de logout
 */
function configurarLogout() {
  const btnLogout = document.getElementById('btn-logout');

  btnLogout.addEventListener('click', async () => {
    if (confirm('Deseja realmente sair do sistema?')) {
      await window.electronAPI.auth.logout();
      window.electronAPI.navigate('login');
    }
  });
}

/**
 * Funções utilitárias para uso nas páginas
 */
window.utils = {
  // Formatar moeda
  formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  },

  // Formatar data
  formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
  },

  // Formatar data e hora
  formatarDataHora(data) {
    return new Date(data).toLocaleString('pt-BR');
  },

  // Mostrar mensagem de sucesso
  mostrarSucesso(mensagem) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = mensagem;
    
    const contentArea = document.getElementById('content-area');
    contentArea.insertBefore(alert, contentArea.firstChild);
    
    setTimeout(() => alert.remove(), 5000);
  },

  // Mostrar mensagem de erro
  mostrarErro(mensagem) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.textContent = mensagem;
    
    const contentArea = document.getElementById('content-area');
    contentArea.insertBefore(alert, contentArea.firstChild);
    
    setTimeout(() => alert.remove(), 5000);
  },

  // Confirmar ação
  confirmar(mensagem) {
    return confirm(mensagem);
  }
};

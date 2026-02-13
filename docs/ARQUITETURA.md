# 📙 Arquitetura Técnica - ERP E-commerce

Documentação técnica completa do sistema para desenvolvedores.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura de Diretórios](#estrutura-de-diretórios)
5. [Banco de Dados](#banco-de-dados)
6. [Backend (Electron)](#backend-electron)
7. [Frontend (Renderer)](#frontend-renderer)
8. [Fluxo de Dados](#fluxo-de-dados)
9. [Segurança](#segurança)
10. [Boas Práticas](#boas-práticas)

---

## 🎯 Visão Geral

O sistema ERP E-commerce é uma aplicação desktop construída com Electron, utilizando:

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Backend:** Node.js com Electron
- **Banco de Dados:** SQLite3
- **Arquitetura:** MVC (Model-View-Controller)

### Características Principais

- ✅ Aplicação desktop multiplataforma
- ✅ Banco de dados local (SQLite)
- ✅ Offline-first (funciona sem internet)
- ✅ Interface moderna e responsiva
- ✅ Modular e extensível

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────┐
│           RENDERER PROCESS              │
│  (Interface do Usuário - Frontend)      │
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │  HTML    │  │   CSS    │           │
│  │  Pages   │  │  Styles  │           │
│  └──────────┘  └──────────┘           │
│       │              │                  │
│       └──────┬───────┘                  │
│              │                          │
│       ┌──────▼───────┐                 │
│       │  JavaScript  │                 │
│       │   (ES6+)     │                 │
│       └──────┬───────┘                 │
│              │                          │
└──────────────┼──────────────────────────┘
               │ IPC (Inter-Process Communication)
               │ contextBridge / preload.js
┌──────────────▼──────────────────────────┐
│           MAIN PROCESS                  │
│  (Backend - Node.js/Electron)           │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │       IPC Handlers               │  │
│  │  (produtos, vendas, clientes...) │  │
│  └──────────┬───────────────────────┘  │
│             │                           │
│  ┌──────────▼───────────────────────┐  │
│  │         Services                 │  │
│  │  (Lógica de Negócio)             │  │
│  └──────────┬───────────────────────┘  │
│             │                           │
│  ┌──────────▼───────────────────────┐  │
│  │       Database Layer             │  │
│  │  (SQLite - db.js)                │  │
│  └──────────┬───────────────────────┘  │
│             │                           │
└─────────────┼───────────────────────────┘
              │
      ┌───────▼────────┐
      │   SQLite DB    │
      │  (database.db) │
      └────────────────┘
```

---

## 🛠️ Tecnologias Utilizadas

### Core

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Node.js | 18+ | Runtime JavaScript |
| Electron | 28.0.0 | Framework desktop |
| SQLite3 | 5.1.6 | Banco de dados |

### Frontend

| Biblioteca | Versão | Uso |
|-----------|--------|-----|
| HTML5 | - | Estrutura |
| CSS3 | - | Estilos |
| JavaScript | ES6+ | Lógica |
| Flexbox/Grid | - | Layout |

### Backend

| Biblioteca | Versão | Uso |
|-----------|--------|-----|
| bcryptjs | 2.4.3 | Hash de senhas |
| exceljs | 4.3.0 | Excel |
| nodemailer | 6.9.7 | E-mails |
| pdfkit | 0.13.0 | PDFs |
| winston | 3.11.0 | Logs |
| node-cron | 3.0.3 | Agendamentos |
| uuid | 9.0.1 | IDs únicos |

---

## 📂 Estrutura de Diretórios

```
erp-ecommerce-completo/
│
├── src/
│   ├── main/                      # Backend (Main Process)
│   │   ├── main.js                # Processo principal
│   │   ├── preload.js             # Bridge segura
│   │   │
│   │   ├── database/
│   │   │   ├── db.js              # Conexão SQLite
│   │   │   ├── migrations.js      # Schema do banco
│   │   │   └── backup.js          # Sistema de backup
│   │   │
│   │   ├── services/              # Lógica de negócio
│   │   │   ├── ProdutoService.js
│   │   │   ├── VendaService.js
│   │   │   ├── CompraService.js
│   │   │   ├── EstoqueService.js
│   │   │   ├── FinanceiroService.js
│   │   │   ├── FiscalService.js
│   │   │   ├── ClienteService.js
│   │   │   ├── FornecedorService.js
│   │   │   ├── UsuarioService.js
│   │   │   └── EcommerceService.js
│   │   │
│   │   └── handlers/              # IPC Handlers
│   │       ├── produtos.js
│   │       ├── vendas.js
│   │       ├── compras.js
│   │       ├── estoque.js
│   │       ├── financeiro.js
│   │       ├── fiscal.js
│   │       ├── ecommerce.js
│   │       ├── ferramentas.js
│   │       └── auth.js
│   │
│   └── renderer/                  # Frontend (Renderer Process)
│       ├── login.html             # Tela de login
│       ├── retaguarda.html        # Menu principal
│       │
│       ├── pages/                 # Páginas do sistema
│       │   ├── produtos.html
│       │   ├── clientes.html
│       │   ├── vendas.html
│       │   └── ...
│       │
│       ├── css/                   # Estilos
│       │   ├── style.css          # Estilos globais
│       │   └── retaguarda.css     # Menu/layout
│       │
│       └── js/                    # Scripts
│           ├── retaguarda.js      # Lógica do menu
│           └── ...
│
├── data/                          # Dados
│   ├── database.db                # Banco SQLite
│   ├── backups/                   # Backups
│   ├── logs/                      # Logs
│   ├── imports/                   # Importações
│   └── exports/                   # Exportações
│
├── docs/                          # Documentação
│   ├── INSTALACAO.md
│   ├── COMO-USAR.md
│   └── ARQUITETURA.md
│
├── package.json                   # Dependências
└── README.md                      # Readme principal
```

---

## 🗄️ Banco de Dados

### Schema Completo

O sistema utiliza 20 tabelas principais:

#### 1. **usuarios**
```sql
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'operador',
  ativo INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **produtos**
```sql
CREATE TABLE produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_barras TEXT UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria_id INTEGER,
  preco_custo REAL DEFAULT 0,
  preco_venda REAL DEFAULT 0,
  margem_lucro REAL DEFAULT 0,
  unidade TEXT DEFAULT 'UN',
  estoque_minimo INTEGER DEFAULT 0,
  estoque_maximo INTEGER DEFAULT 0,
  ncm TEXT,
  cest TEXT,
  cfop TEXT,
  cst_icms TEXT,
  cst_pis TEXT,
  cst_cofins TEXT,
  imagem TEXT,
  ativo INTEGER DEFAULT 1,
  ecommerce_ativo INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);
```

#### 3. **estoque**
```sql
CREATE TABLE estoque (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL UNIQUE,
  quantidade REAL DEFAULT 0,
  reservado REAL DEFAULT 0,
  disponivel REAL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
```

#### 4. **vendas** e **vendas_itens**
```sql
CREATE TABLE vendas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero INTEGER NOT NULL,
  cliente_id INTEGER,
  usuario_id INTEGER NOT NULL,
  tipo TEXT DEFAULT 'VENDA',
  status TEXT DEFAULT 'CONCLUIDA',
  subtotal REAL DEFAULT 0,
  desconto REAL DEFAULT 0,
  total REAL DEFAULT 0,
  forma_pagamento TEXT,
  observacoes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE vendas_itens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venda_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  quantidade REAL NOT NULL,
  preco_unitario REAL NOT NULL,
  desconto REAL DEFAULT 0,
  total REAL NOT NULL,
  FOREIGN KEY (venda_id) REFERENCES vendas(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
```

*(Demais tabelas seguem padrões similares)*

### Relacionamentos

```
usuarios ──┬── vendas
           ├── compras
           └── logs_sistema

produtos ──┬── estoque
           ├── vendas_itens
           ├── compras_itens
           └── categorias

clientes ──┬── vendas
           ├── pedidos_ecommerce
           └── lgpd_consentimentos

fornecedores ── compras
```

---

## 🔧 Backend (Electron)

### Main Process (main.js)

Responsável por:
- Criar janelas
- Gerenciar ciclo de vida do app
- Inicializar banco de dados
- Carregar handlers IPC

```javascript
// Exemplo de estrutura
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  
  mainWindow.loadFile('renderer/login.html');
}

app.whenReady().then(createWindow);
```

### Preload Script (preload.js)

Bridge segura entre Main e Renderer:

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  produtos: {
    listar: (filtros) => ipcRenderer.invoke('produtos:listar', filtros),
    criar: (produto) => ipcRenderer.invoke('produtos:criar', produto)
  }
});
```

### Services

Cada service gerencia uma entidade do sistema:

```javascript
// Exemplo: ProdutoService.js
class ProdutoService {
  static async listar(filtros = {}) {
    const db = getDatabase();
    // Lógica de busca
    return produtos;
  }
  
  static async criar(dados) {
    const db = getDatabase();
    // Lógica de criação
    return produto;
  }
}
```

### IPC Handlers

Conectam o frontend aos services:

```javascript
// Exemplo: handlers/produtos.js
const { ipcMain } = require('electron');
const ProdutoService = require('../services/ProdutoService');

ipcMain.handle('produtos:listar', async (event, filtros) => {
  return await ProdutoService.listar(filtros);
});
```

---

## 🎨 Frontend (Renderer)

### Estrutura HTML

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <!-- Conteúdo -->
  <script src="js/script.js"></script>
</body>
</html>
```

### Comunicação com Backend

```javascript
// No renderer process
async function carregarProdutos() {
  const produtos = await window.electronAPI.produtos.listar();
  renderizarProdutos(produtos);
}
```

### CSS (Padrões)

```css
/* Variáveis CSS */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #48bb78;
  --danger-color: #f56565;
}

/* Classes utilitárias */
.btn-primary {
  background: var(--primary-color);
  color: white;
}
```

---

## 🔄 Fluxo de Dados

### Exemplo: Criar Produto

```
1. [RENDERER] Usuário preenche formulário
              ↓
2. [RENDERER] JavaScript captura dados
              ↓
3. [RENDERER] window.electronAPI.produtos.criar(dados)
              ↓
4. [PRELOAD] contextBridge intercepta
              ↓
5. [MAIN] Handler 'produtos:criar' recebe
              ↓
6. [SERVICE] ProdutoService.criar(dados)
              ↓
7. [DATABASE] INSERT no SQLite
              ↓
8. [SERVICE] Retorna produto criado
              ↓
9. [HANDLER] Retorna para renderer
              ↓
10. [RENDERER] Atualiza interface
```

---

## 🔒 Segurança

### Implementações

1. **Context Isolation**: Ativado
2. **Node Integration**: Desativado  
3. **Senhas**: Hash com bcrypt
4. **SQL Injection**: Prepared statements
5. **XSS**: Sanitização de inputs

### Exemplo de Hash de Senha

```javascript
const bcrypt = require('bcryptjs');

// Criar hash
const hash = bcrypt.hashSync(senha, 10);

// Verificar
const valido = bcrypt.compareSync(senha, hash);
```

---

## 📚 Boas Práticas

### Backend

1. **Services isolados**: Cada service gerencia uma entidade
2. **Transações**: Use para operações múltiplas
3. **Error handling**: Try-catch em todas operações assíncronas
4. **Logs**: Registre operações importantes

### Frontend

1. **Separação de responsabilidades**: HTML (estrutura), CSS (estilo), JS (lógica)
2. **Feedback visual**: Loading, sucesso, erro
3. **Validação**: Cliente e servidor
4. **Acessibilidade**: Labels, ARIA

### Banco de Dados

1. **Índices**: Em campos de busca frequente
2. **Foreign keys**: Sempre que houver relacionamento
3. **Migrations**: Versionamento do schema
4. **Backups**: Automáticos e frequentes

---

## 🧪 Testes

### Estrutura de Testes (Futura)

```javascript
describe('ProdutoService', () => {
  test('deve criar produto', async () => {
    const produto = await ProdutoService.criar({
      nome: 'Teste',
      preco_venda: 10
    });
    
    expect(produto.id).toBeDefined();
    expect(produto.nome).toBe('Teste');
  });
});
```

---

## 📞 Contribuindo

Para contribuir com o desenvolvimento:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Siga os padrões do código
4. Comente seu código
5. Teste suas alterações
6. Commit (`git commit -m 'Add: MinhaFeature'`)
7. Push (`git push origin feature/MinhaFeature`)
8. Abra um Pull Request

---

**Última atualização:** 2026-02-13  
**Versão do documento:** 1.0

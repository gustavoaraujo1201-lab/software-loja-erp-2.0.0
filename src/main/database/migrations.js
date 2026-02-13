/**
 * Migrações do banco de dados
 * Cria todas as tabelas necessárias para o sistema
 */

/**
 * Inicializa todas as tabelas do banco
 */
async function initializeMigrations(db) {
  try {
    console.log('🔄 Iniciando migrações do banco de dados...');

    // 1. Tabela de usuários
    await db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        tipo TEXT NOT NULL DEFAULT 'operador',
        ativo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Tabela de categorias
    await db.run(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        ativo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Tabela de produtos
    await db.run(`
      CREATE TABLE IF NOT EXISTS produtos (
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
      )
    `);

    // 4. Tabela de estoque
    await db.run(`
      CREATE TABLE IF NOT EXISTS estoque (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto_id INTEGER NOT NULL UNIQUE,
        quantidade REAL DEFAULT 0,
        reservado REAL DEFAULT 0,
        disponivel REAL DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
      )
    `);

    // 5. Tabela de movimentações de estoque
    await db.run(`
      CREATE TABLE IF NOT EXISTS estoque_movimentacao (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto_id INTEGER NOT NULL,
        tipo TEXT NOT NULL,
        quantidade REAL NOT NULL,
        motivo TEXT,
        documento TEXT,
        usuario_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (produto_id) REFERENCES produtos(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      )
    `);

    // 6. Tabela de clientes
    await db.run(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_pessoa TEXT DEFAULT 'F',
        cpf_cnpj TEXT UNIQUE,
        nome TEXT NOT NULL,
        razao_social TEXT,
        email TEXT,
        telefone TEXT,
        celular TEXT,
        cep TEXT,
        logradouro TEXT,
        numero TEXT,
        complemento TEXT,
        bairro TEXT,
        cidade TEXT,
        uf TEXT,
        data_nascimento DATE,
        observacoes TEXT,
        ativo INTEGER DEFAULT 1,
        ecommerce_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. Tabela de fornecedores
    await db.run(`
      CREATE TABLE IF NOT EXISTS fornecedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cnpj TEXT UNIQUE,
        razao_social TEXT NOT NULL,
        nome_fantasia TEXT,
        email TEXT,
        telefone TEXT,
        cep TEXT,
        logradouro TEXT,
        numero TEXT,
        complemento TEXT,
        bairro TEXT,
        cidade TEXT,
        uf TEXT,
        observacoes TEXT,
        ativo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 8. Tabela de vendas
    await db.run(`
      CREATE TABLE IF NOT EXISTS vendas (
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
      )
    `);

    // 9. Tabela de itens de vendas
    await db.run(`
      CREATE TABLE IF NOT EXISTS vendas_itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venda_id INTEGER NOT NULL,
        produto_id INTEGER NOT NULL,
        quantidade REAL NOT NULL,
        preco_unitario REAL NOT NULL,
        desconto REAL DEFAULT 0,
        total REAL NOT NULL,
        FOREIGN KEY (venda_id) REFERENCES vendas(id),
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
      )
    `);

    // 10. Tabela de compras
    await db.run(`
      CREATE TABLE IF NOT EXISTS compras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero INTEGER NOT NULL,
        fornecedor_id INTEGER NOT NULL,
        usuario_id INTEGER NOT NULL,
        status TEXT DEFAULT 'CONCLUIDA',
        subtotal REAL DEFAULT 0,
        desconto REAL DEFAULT 0,
        frete REAL DEFAULT 0,
        outras_despesas REAL DEFAULT 0,
        total REAL DEFAULT 0,
        observacoes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      )
    `);

    // 11. Tabela de itens de compras
    await db.run(`
      CREATE TABLE IF NOT EXISTS compras_itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compra_id INTEGER NOT NULL,
        produto_id INTEGER NOT NULL,
        quantidade REAL NOT NULL,
        preco_unitario REAL NOT NULL,
        total REAL NOT NULL,
        FOREIGN KEY (compra_id) REFERENCES compras(id),
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
      )
    `);

    // 12. Tabela de categorias financeiras
    await db.run(`
      CREATE TABLE IF NOT EXISTS financeiro_categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL,
        ativo INTEGER DEFAULT 1
      )
    `);

    // 13. Tabela de contas a pagar/receber
    await db.run(`
      CREATE TABLE IF NOT EXISTS financeiro_contas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        categoria_id INTEGER,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        data_vencimento DATE NOT NULL,
        data_pagamento DATE,
        valor_pago REAL,
        status TEXT DEFAULT 'PENDENTE',
        pessoa_id INTEGER,
        pessoa_tipo TEXT,
        observacoes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoria_id) REFERENCES financeiro_categorias(id)
      )
    `);

    // 14. Tabela de notas fiscais
    await db.run(`
      CREATE TABLE IF NOT EXISTS nfe (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero INTEGER NOT NULL,
        serie TEXT DEFAULT '1',
        chave TEXT UNIQUE,
        tipo TEXT DEFAULT 'SAIDA',
        venda_id INTEGER,
        compra_id INTEGER,
        cliente_id INTEGER,
        fornecedor_id INTEGER,
        valor REAL NOT NULL,
        status TEXT DEFAULT 'PENDENTE',
        xml TEXT,
        protocolo TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (venda_id) REFERENCES vendas(id),
        FOREIGN KEY (compra_id) REFERENCES compras(id),
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
      )
    `);

    // 15. Tabela de pedidos do e-commerce
    await db.run(`
      CREATE TABLE IF NOT EXISTS pedidos_ecommerce (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ecommerce_id INTEGER NOT NULL,
        cliente_id INTEGER,
        status TEXT DEFAULT 'PENDENTE',
        subtotal REAL DEFAULT 0,
        frete REAL DEFAULT 0,
        desconto REAL DEFAULT 0,
        total REAL DEFAULT 0,
        forma_pagamento TEXT,
        endereco_entrega TEXT,
        venda_id INTEGER,
        importado INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        imported_at DATETIME,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (venda_id) REFERENCES vendas(id)
      )
    `);

    // 16. Tabela de logs do sistema
    await db.run(`
      CREATE TABLE IF NOT EXISTS logs_sistema (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nivel TEXT NOT NULL,
        categoria TEXT NOT NULL,
        mensagem TEXT NOT NULL,
        detalhes TEXT,
        usuario_id INTEGER,
        ip TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      )
    `);

    // 17. Tabela de backups
    await db.run(`
      CREATE TABLE IF NOT EXISTS backups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_arquivo TEXT NOT NULL,
        tamanho INTEGER,
        tipo TEXT DEFAULT 'MANUAL',
        status TEXT DEFAULT 'SUCESSO',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 18. Tabela de tarefas agendadas
    await db.run(`
      CREATE TABLE IF NOT EXISTS tarefas_agendadas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL,
        frequencia TEXT NOT NULL,
        parametros TEXT,
        ativo INTEGER DEFAULT 1,
        ultima_execucao DATETIME,
        proxima_execucao DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 19. Tabela de log de sincronização
    await db.run(`
      CREATE TABLE IF NOT EXISTS sincronizacao_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        direcao TEXT NOT NULL,
        status TEXT NOT NULL,
        registros_processados INTEGER DEFAULT 0,
        registros_sucesso INTEGER DEFAULT 0,
        registros_erro INTEGER DEFAULT 0,
        detalhes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 20. Tabela de consentimentos LGPD
    await db.run(`
      CREATE TABLE IF NOT EXISTS lgpd_consentimentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        tipo TEXT NOT NULL,
        consentimento INTEGER DEFAULT 0,
        ip TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
      )
    `);

    // Criar índices para melhorar performance
    await createIndexes(db);

    // Inserir dados iniciais
    await insertInitialData(db);

    console.log('✅ Migrações concluídas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    throw error;
  }
}

/**
 * Cria índices no banco de dados
 */
async function createIndexes(db) {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_produtos_codigo_barras ON produtos(codigo_barras)',
    'CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id)',
    'CREATE INDEX IF NOT EXISTS idx_estoque_produto ON estoque(produto_id)',
    'CREATE INDEX IF NOT EXISTS idx_clientes_cpf_cnpj ON clientes(cpf_cnpj)',
    'CREATE INDEX IF NOT EXISTS idx_vendas_cliente ON vendas(cliente_id)',
    'CREATE INDEX IF NOT EXISTS idx_vendas_usuario ON vendas(usuario_id)',
    'CREATE INDEX IF NOT EXISTS idx_vendas_data ON vendas(created_at)',
    'CREATE INDEX IF NOT EXISTS idx_compras_fornecedor ON compras(fornecedor_id)',
    'CREATE INDEX IF NOT EXISTS idx_financeiro_vencimento ON financeiro_contas(data_vencimento)',
    'CREATE INDEX IF NOT EXISTS idx_financeiro_status ON financeiro_contas(status)',
    'CREATE INDEX IF NOT EXISTS idx_logs_categoria ON logs_sistema(categoria)',
    'CREATE INDEX IF NOT EXISTS idx_logs_data ON logs_sistema(created_at)'
  ];

  for (const indexSql of indexes) {
    await db.run(indexSql);
  }
}

/**
 * Insere dados iniciais no banco
 */
async function insertInitialData(db) {
  // Verificar se já existem dados
  const userCount = await db.get('SELECT COUNT(*) as count FROM usuarios');
  
  if (userCount.count === 0) {
    // Inserir usuário administrador padrão
    // Senha: admin123 (deve ser alterada após primeiro login)
    const bcrypt = require('bcryptjs');
    const senhaHash = bcrypt.hashSync('admin123', 10);
    
    await db.run(`
      INSERT INTO usuarios (nome, email, senha, tipo)
      VALUES ('Administrador', 'admin@sistema.com', ?, 'admin')
    `, [senhaHash]);

    // Inserir categorias padrão
    await db.run(`
      INSERT INTO categorias (nome, descricao) VALUES
      ('Geral', 'Categoria geral'),
      ('Eletrônicos', 'Produtos eletrônicos'),
      ('Vestuário', 'Roupas e acessórios'),
      ('Alimentos', 'Produtos alimentícios'),
      ('Bebidas', 'Bebidas em geral')
    `);

    // Inserir categorias financeiras padrão
    await db.run(`
      INSERT INTO financeiro_categorias (nome, tipo) VALUES
      ('Venda', 'RECEITA'),
      ('Devolução', 'RECEITA'),
      ('Compra', 'DESPESA'),
      ('Salários', 'DESPESA'),
      ('Aluguel', 'DESPESA'),
      ('Energia', 'DESPESA'),
      ('Internet', 'DESPESA'),
      ('Manutenção', 'DESPESA')
    `);

    console.log('✅ Dados iniciais inseridos com sucesso');
    console.log('📧 Login padrão: admin@sistema.com');
    console.log('🔑 Senha padrão: admin123');
  }
}

module.exports = { initializeMigrations };

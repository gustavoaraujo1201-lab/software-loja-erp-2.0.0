# 📗 Como Usar o Sistema ERP E-commerce

Guia completo de uso do sistema, com tutoriais passo a passo para cada funcionalidade.

## 📋 Índice

1. [Login no Sistema](#login-no-sistema)
2. [Navegação no Menu](#navegação-no-menu)
3. [Cadastro de Produtos](#cadastro-de-produtos)
4. [Cadastro de Clientes](#cadastro-de-clientes)
5. [Cadastro de Fornecedores](#cadastro-de-fornecedores)
6. [Registro de Vendas](#registro-de-vendas)
7. [Registro de Compras](#registro-de-compras)
8. [Controle de Estoque](#controle-de-estoque)
9. [Gestão Financeira](#gestão-financeira)
10. [PDV - Ponto de Venda](#pdv---ponto-de-venda)
11. [Ferramentas](#ferramentas)
12. [Relatórios](#relatórios)

---

## 🔐 Login no Sistema

### Primeiro Acesso

1. Abra o sistema com `npm start`
2. Na tela de login, digite:
   - **E-mail:** admin@sistema.com
   - **Senha:** admin123
3. Clique em **Entrar**

### ⚠️ Segurança

Após o primeiro login:
- Vá em **Cadastros → Usuários**
- Altere a senha padrão
- Crie usuários para sua equipe

---

## 🧭 Navegação no Menu

O sistema possui um menu lateral organizado em seções:

### Menu Principal

- **📦 CADASTROS** - Produtos, clientes, fornecedores, etc.
- **💰 MOVIMENTAÇÕES** - Vendas, compras, PDV
- **📊 ESTOQUE** - Consulta e controle de estoque
- **💵 FINANCEIRO** - Contas a pagar/receber
- **📄 FISCAL** - Notas fiscais
- **🛒 E-COMMERCE** - Sincronização e pedidos online
- **🔧 FERRAMENTAS** - Utilitários do sistema
- **📊 RELATÓRIOS** - Relatórios gerenciais

### Busca no Menu

Use o campo de busca no topo do menu para encontrar rapidamente qualquer funcionalidade:

1. Digite o nome da funcionalidade
2. O menu será filtrado automaticamente
3. Clique na opção desejada

---

## 📦 Cadastro de Produtos

### Como Cadastrar um Produto

1. No menu lateral, clique em **Cadastros → Produtos**
2. Clique no botão **➕ Novo Produto**
3. Preencha os dados:

   **Dados Básicos:**
   - **Código de Barras:** (opcional)
   - **Nome:** Nome do produto (obrigatório)
   - **Categoria:** Selecione uma categoria
   - **Unidade:** UN, PC, KG, L, etc.

   **Preços:**
   - **Preço de Custo:** Quanto você paga pelo produto
   - **Preço de Venda:** Quanto você vende (obrigatório)
   
   **Estoque:**
   - **Estoque Mínimo:** Alerta quando estoque baixar
   - **Estoque Máximo:** Limite máximo de estoque

   **Descrição:**
   - Informações adicionais do produto

4. Clique em **Salvar**

### Editar um Produto

1. Na lista de produtos, clique no botão **✏️** do produto
2. Altere os dados necessários
3. Clique em **Salvar**

### Deletar um Produto

1. Na lista de produtos, clique no botão **🗑️**
2. Confirme a exclusão
3. **Nota:** Se o produto tiver movimentações, ele será apenas desativado

### Buscar Produtos

Use o campo de busca no topo da página para procurar por:
- Nome do produto
- Código de barras

---

## 👥 Cadastro de Clientes

### Como Cadastrar um Cliente

1. Vá em **Cadastros → Clientes**
2. Clique em **➕ Novo Cliente**
3. Preencha:

   **Tipo de Pessoa:**
   - **Pessoa Física (PF):** CPF
   - **Pessoa Jurídica (PJ):** CNPJ

   **Dados Pessoais:**
   - Nome/Razão Social
   - CPF/CNPJ
   - E-mail
   - Telefone/Celular
   - Data de Nascimento (PF)

   **Endereço:**
   - CEP
   - Logradouro
   - Número
   - Complemento
   - Bairro
   - Cidade
   - UF

   **Observações:**
   - Informações adicionais

4. Clique em **Salvar**

### Dicas

- Use o CEP para preenchimento automático do endereço
- Cadastre clientes antes de fazer vendas a prazo
- Mantenha os dados atualizados

---

## 🏭 Cadastro de Fornecedores

### Como Cadastrar um Fornecedor

1. Vá em **Cadastros → Fornecedores**
2. Clique em **➕ Novo Fornecedor**
3. Preencha os dados:
   - CNPJ
   - Razão Social
   - Nome Fantasia
   - E-mail
   - Telefone
   - Endereço completo
   - Observações

4. Clique em **Salvar**

---

## 💰 Registro de Vendas

### Como Fazer uma Venda

1. Vá em **Movimentações → Vendas**
2. Clique em **➕ Nova Venda**
3. Adicione produtos:
   - Digite o código de barras OU
   - Busque pelo nome do produto
   - Informe a quantidade
   - Clique em **Adicionar**

4. Selecione o cliente (opcional para venda à vista)
5. Escolha a forma de pagamento:
   - Dinheiro
   - Cartão
   - PIX
   - À Prazo

6. Aplique desconto se necessário
7. Clique em **Finalizar Venda**

### Venda à Prazo

Para vendas parceladas:

1. Selecione **À Prazo** como forma de pagamento
2. Informe o número de parcelas
3. Defina as datas de vencimento
4. O sistema criará automaticamente as contas a receber

### Cancelar uma Venda

1. Na lista de vendas, encontre a venda
2. Clique em **Cancelar**
3. Informe o motivo do cancelamento
4. Confirme

**Atenção:** O estoque será devolvido automaticamente.

---

## 📦 Registro de Compras

### Como Registrar uma Compra

1. Vá em **Movimentações → Compras**
2. Clique em **➕ Nova Compra**
3. Selecione o fornecedor
4. Adicione produtos:
   - Selecione o produto
   - Quantidade
   - Preço unitário de compra
   - Adicionar

5. Informe valores adicionais:
   - Frete
   - Outras despesas
   - Desconto

6. Clique em **Finalizar Compra**

**O que acontece:**
- ✅ Produtos entram no estoque automaticamente
- ✅ Preço de custo é atualizado
- ✅ Contas a pagar são geradas (se configurado)

---

## 📊 Controle de Estoque

### Consultar Estoque

1. Vá em **Estoque → Consulta de Estoque**
2. Visualize:
   - Quantidade disponível
   - Quantidade reservada
   - Estoque mínimo/máximo
   - Produtos com estoque baixo

### Ajustar Estoque

Para ajustes manuais (inventário):

1. Vá em **Estoque → Consulta de Estoque**
2. Clique em **Ajustar** no produto
3. Informe:
   - Quantidade (+ para adicionar, - para remover)
   - Motivo do ajuste
4. Confirme

### Ver Movimentações

1. Clique no produto
2. Vá em **Movimentações**
3. Visualize histórico completo:
   - Entradas (compras)
   - Saídas (vendas)
   - Ajustes
   - Data e hora
   - Responsável

---

## 💵 Gestão Financeira

### Contas a Pagar

1. Vá em **Financeiro → Contas a Pagar**
2. Visualize contas pendentes
3. Para dar baixa:
   - Clique em **Pagar**
   - Informe data e valor do pagamento
   - Confirme

### Contas a Receber

1. Vá em **Financeiro → Contas a Receber**
2. Visualize títulos a receber
3. Para dar baixa:
   - Clique em **Receber**
   - Informe data e valor recebido
   - Confirme

### Fluxo de Caixa

1. Vá em **Financeiro → Fluxo de Caixa**
2. Selecione o período
3. Visualize:
   - Total de receitas
   - Total de despesas
   - Saldo do período
   - Gráficos

---

## 🏪 PDV - Ponto de Venda

O PDV é uma interface simplificada para vendas rápidas.

### Como Usar o PDV

1. Clique em **Movimentações → PDV**
2. Use o leitor de código de barras OU
   - Digite o código e pressione Enter
3. Os produtos são adicionados automaticamente
4. Para alterar quantidade, clique no produto
5. Selecione a forma de pagamento
6. Clique em **Finalizar (F2)**

### Atalhos do Teclado

- **F2** - Finalizar venda
- **F4** - Cancelar venda
- **F5** - Buscar produto
- **F8** - Abrir gaveta
- **ESC** - Remover último item

---

## 🔧 Ferramentas

### Backup

**Criar Backup:**
1. Vá em **Ferramentas → Backup**
2. Clique em **Criar Backup**
3. Aguarde conclusão

**Restaurar Backup:**
1. Vá em **Ferramentas → Backup**
2. Selecione o backup desejado
3. Clique em **Restaurar**
4. Confirme (o sistema será reiniciado)

### Importação de Dados

1. Vá em **Ferramentas → Importação**
2. Selecione o tipo (Produtos, Clientes, etc.)
3. Escolha o arquivo (Excel ou CSV)
4. Mapeie as colunas
5. Clique em **Importar**

### Exportação de Dados

1. Vá em **Ferramentas → Exportação**
2. Selecione o que deseja exportar
3. Escolha o formato (Excel, CSV, PDF)
4. Clique em **Exportar**
5. Salve o arquivo

### Logs do Sistema

1. Vá em **Ferramentas → Logs**
2. Filtre por:
   - Data
   - Categoria
   - Usuário
3. Visualize todas as operações realizadas

---

## 📊 Relatórios

### Gerar Relatórios

1. Vá em **Relatórios**
2. Selecione o tipo:
   - Vendas
   - Compras
   - Estoque
   - Financeiro
3. Defina filtros:
   - Período
   - Cliente/Fornecedor
   - Categoria
4. Clique em **Gerar Relatório**
5. Visualize na tela ou exporte (PDF/Excel)

---

## 💡 Dicas de Uso

### Produtividade

- Use a busca no menu para encontrar funcionalidades rapidamente
- Configure atalhos para operações frequentes
- Use o PDV para vendas no balcão
- Configure backups automáticos

### Organização

- Mantenha os cadastros sempre atualizados
- Use categorias para organizar produtos
- Faça conciliação bancária mensalmente
- Revise contas a pagar/receber semanalmente

### Segurança

- Altere senhas periodicamente
- Faça backups regulares
- Limite acessos por tipo de usuário
- Mantenha o sistema atualizado

---

## ❓ Dúvidas Frequentes

### Como alterar minha senha?
Vá em Cadastros → Usuários → Clique no seu usuário → Alterar Senha

### Como adicionar mais usuários?
Vá em Cadastros → Usuários → Novo Usuário

### O que fazer se o estoque estiver errado?
Vá em Estoque → Consulta de Estoque → Ajustar

### Como desfazer uma venda?
Vá em Movimentações → Vendas → Encontre a venda → Cancelar

### Como ver minhas vendas do dia?
Vá em Relatórios → Vendas → Filtrar por "Hoje"

---

## 📞 Precisa de Ajuda?

- 📖 Consulte a [documentação técnica](ARQUITETURA.md)
- 🐛 Reporte problemas em: [GitHub Issues](https://github.com/gustavoaraujo1201-lab/software-loja-erp-2.0.0/issues)

---

**Última atualização:** 2026-02-13  
**Versão do documento:** 1.0

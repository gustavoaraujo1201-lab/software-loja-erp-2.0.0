# 📘 Guia de Instalação - ERP E-commerce

Este guia mostra passo a passo como instalar e executar o sistema ERP E-commerce no seu computador.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação do Node.js](#instalação-do-nodejs)
3. [Download do Sistema](#download-do-sistema)
4. [Instalação das Dependências](#instalação-das-dependências)
5. [Execução do Sistema](#execução-do-sistema)
6. [Primeiro Acesso](#primeiro-acesso)
7. [Resolução de Problemas](#resolução-de-problemas)

---

## 🔧 Pré-requisitos

Antes de instalar o sistema, você precisará ter instalado no seu computador:

- **Node.js** versão 18 ou superior
- **NPM** (vem instalado junto com o Node.js)
- Sistema Operacional: Windows 10+, Linux ou macOS

### Verificar se já tem Node.js instalado

Abra o terminal (Prompt de Comando no Windows ou Terminal no Linux/Mac) e digite:

```bash
node --version
```

Se aparecer algo como `v18.x.x` ou superior, você já tem o Node.js instalado!

Se aparecer um erro, siga para o próximo passo.

---

## 📥 Instalação do Node.js

### Windows

1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (recomendada)
3. Execute o instalador baixado
4. Clique em "Next" em todas as etapas
5. Ao final, clique em "Finish"

### Linux (Ubuntu/Debian)

```bash
# Atualizar repositórios
sudo apt update

# Instalar Node.js
sudo apt install nodejs npm -y

# Verificar instalação
node --version
npm --version
```

### macOS

```bash
# Com Homebrew instalado
brew install node

# Verificar instalação
node --version
npm --version
```

---

## 💾 Download do Sistema

### Opção 1: Usando Git (Recomendado)

Se você tem Git instalado:

```bash
git clone https://github.com/gustavoaraujo1201-lab/software-loja-erp-2.0.0.git
cd software-loja-erp-2.0.0
```

### Opção 2: Download Direto

1. Acesse: https://github.com/gustavoaraujo1201-lab/software-loja-erp-2.0.0
2. Clique no botão verde **"Code"**
3. Clique em **"Download ZIP"**
4. Extraia o arquivo ZIP em uma pasta de sua escolha
5. Abra o terminal/prompt nessa pasta

---

## 📦 Instalação das Dependências

Com o terminal aberto na pasta do projeto, execute:

```bash
npm install
```

Este comando irá:
- ✅ Baixar todas as bibliotecas necessárias
- ✅ Instalar o Electron
- ✅ Configurar o ambiente

**Aguarde!** Esse processo pode levar de 2 a 10 minutos dependendo da sua internet.

Você verá algo assim quando terminar:
```
added 300 packages in 2m
```

---

## 🚀 Execução do Sistema

### Modo Normal

Para executar o sistema:

```bash
npm start
```

O sistema abrirá automaticamente em uma janela desktop!

### Modo Desenvolvimento (com DevTools)

Para desenvolvedores:

```bash
npm run dev
```

Isso abrirá o sistema com as ferramentas de desenvolvedor (DevTools) ativadas.

---

## 🔑 Primeiro Acesso

Quando o sistema abrir, você verá a tela de login.

### Credenciais Padrão

- **E-mail:** `admin@sistema.com`
- **Senha:** `admin123`

### ⚠️ IMPORTANTE

Após fazer o primeiro login:

1. Vá em **Cadastros → Usuários**
2. Clique no usuário **Administrador**
3. **Altere a senha** para uma senha segura
4. Clique em **Salvar**

---

## 🛠️ Resolução de Problemas

### Problema: "node: command not found"

**Solução:** Node.js não está instalado ou não está no PATH.

- Reinstale o Node.js seguindo as instruções acima
- No Windows, reinicie o computador após a instalação

### Problema: "npm ERR! EACCES: permission denied"

**Solução (Linux/Mac):**

```bash
sudo npm install
```

Ou configure permissões do npm corretamente:

```bash
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### Problema: "electron: command not found"

**Solução:**

```bash
# Reinstalar dependências
rm -rf node_modules
npm install
```

### Problema: Erro ao abrir banco de dados

**Solução:**

O banco de dados é criado automaticamente na primeira execução.

Se houver erro:

1. Verifique se a pasta `data` existe
2. Se não existir, crie manualmente:

```bash
mkdir data
```

3. Execute o sistema novamente

### Problema: "Cannot find module"

**Solução:**

```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules
npm install
```

### Problema: Tela branca ao abrir o sistema

**Solução:**

1. Feche o sistema
2. Execute em modo desenvolvimento:

```bash
npm run dev
```

3. Verifique os erros no console (DevTools)
4. Relate o erro nas Issues do GitHub

---

## 📂 Estrutura de Pastas Após Instalação

Após a instalação, você terá:

```
software-loja-erp-2.0.0/
├── node_modules/          # Dependências (criada pelo npm install)
├── src/                   # Código fonte
├── data/                  # Banco de dados e arquivos
│   ├── database.db        # Banco SQLite (criado automaticamente)
│   ├── backups/           # Backups automáticos
│   ├── logs/              # Logs do sistema
│   ├── imports/           # Arquivos importados
│   └── exports/           # Arquivos exportados
├── docs/                  # Documentação
├── package.json           # Configurações do projeto
└── package-lock.json      # Versões das dependências
```

---

## 🔄 Atualização do Sistema

Para atualizar o sistema para uma nova versão:

```bash
# Fazer backup do banco de dados primeiro!
cp data/database.db data/database-backup.db

# Baixar atualizações
git pull origin main

# Reinstalar dependências
npm install

# Executar
npm start
```

---

## 💾 Backup dos Dados

**MUITO IMPORTANTE:** Faça backup regular!

### Backup Manual

1. Vá em **Ferramentas → Backup**
2. Clique em **Criar Backup**
3. O backup será salvo em `data/backups/`

### Backup Automático

O sistema cria backups automáticos:
- **Frequência:** Todo dia às 2h da manhã
- **Local:** `data/backups/`
- **Retenção:** Últimos 30 backups

### Backup Manual (Arquivo)

Copie simplesmente o arquivo:

```bash
# Windows
copy data\database.db data\database-backup.db

# Linux/Mac
cp data/database.db data/database-backup.db
```

---

## 🚀 Próximos Passos

Agora que o sistema está instalado:

1. ✅ Leia o [Guia de Uso](COMO-USAR.md)
2. ✅ Configure os usuários do sistema
3. ✅ Cadastre seus produtos
4. ✅ Cadastre clientes e fornecedores
5. ✅ Comece a usar!

---

## 📞 Precisa de Ajuda?

- 📖 Leia a [Documentação Completa](COMO-USAR.md)
- 🐛 Reporte bugs em: [GitHub Issues](https://github.com/gustavoaraujo1201-lab/software-loja-erp-2.0.0/issues)
- 💬 Dúvidas? Abra uma discussão no GitHub

---

## ✅ Checklist de Instalação

Use este checklist para garantir que tudo está funcionando:

- [ ] Node.js instalado e funcionando
- [ ] Projeto baixado/clonado
- [ ] `npm install` executado com sucesso
- [ ] Sistema abre com `npm start`
- [ ] Login realizado com sucesso
- [ ] Senha padrão alterada
- [ ] Menu lateral funcionando
- [ ] Produtos podem ser cadastrados

Se todos os itens estão ✅, parabéns! Seu sistema está pronto para uso!

---

**Última atualização:** 2026-02-13  
**Versão do documento:** 1.0

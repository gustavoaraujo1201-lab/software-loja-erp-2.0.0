# 🏪 ERP E-commerce Completo v2.0.0

Sistema ERP desktop completo com e-commerce integrado, desenvolvido com Electron, Node.js e SQLite.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![Electron](https://img.shields.io/badge/electron-28.0.0-blue.svg)

## 📋 Sobre o Projeto

Este é um sistema ERP (Enterprise Resource Planning) completo e gratuito, desenvolvido para pequenas e médias empresas. Inclui:

- ✅ **Sistema Desktop** (Electron) para retaguarda e PDV
- ✅ **E-commerce** com loja virtual responsiva
- ✅ **Sincronização Automática** entre ERP e loja online
- ✅ **Módulo de Ferramentas** completo
- ✅ **Gestão Completa** de produtos, vendas, compras, estoque e financeiro

## 🎯 Funcionalidades Principais

### 📦 Cadastros
- Produtos com código de barras
- Clientes (PF e PJ)
- Fornecedores
- Categorias
- Usuários e controle de acesso

### 💰 Movimentações
- Registro de vendas
- Registro de compras
- PDV (Ponto de Venda) simplificado
- Controle de formas de pagamento

### 📊 Estoque
- Consulta de estoque em tempo real
- Movimentações (entrada/saída)
- Inventário
- Alertas de estoque mínimo

### 💵 Financeiro
- Contas a pagar
- Contas a receber
- Fluxo de caixa
- Relatórios financeiros

### 📄 Fiscal
- Estrutura para emissão de NF-e
- Consulta de notas fiscais
- Importação de XML de NF-e

### 🛒 E-commerce
- Sincronização de produtos
- Gestão de pedidos online
- Integração automática com estoque
- API REST para loja virtual

### 🔧 Ferramentas
- Importação/Exportação de dados (Excel, CSV)
- Sistema de backup automático
- Logs e auditoria
- Envio de e-mails
- Impressão de etiquetas
- Tarefas agendadas
- LGPD - Gestão de dados pessoais

## 🚀 Começando

### Pré-requisitos

- Node.js 18 ou superior
- NPM (instalado com Node.js)
- Sistema Operacional: Windows, Linux ou macOS

### 📥 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/gustavoaraujo1201-lab/software-loja-erp-2.0.0.git
cd software-loja-erp-2.0.0
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o sistema**
```bash
npm start
```

### 🔑 Acesso Inicial

Na primeira execução, use as credenciais padrão:
- **E-mail:** admin@sistema.com
- **Senha:** admin123

⚠️ **IMPORTANTE:** Altere a senha após o primeiro acesso!

## 📖 Documentação Completa

- [📘 Guia de Instalação Detalhado](docs/INSTALACAO.md)
- [📗 Como Usar o Sistema](docs/COMO-USAR.md)
- [📙 Arquitetura Técnica](docs/ARQUITETURA.md)

## 🛠️ Tecnologias Utilizadas

### Backend
- **Electron** - Framework para aplicações desktop
- **Node.js** - Runtime JavaScript
- **SQLite3** - Banco de dados local
- **Express** - Framework web para API REST

### Frontend
- **HTML5/CSS3** - Interface moderna
- **JavaScript ES6+** - Lógica do frontend
- **Flexbox/Grid** - Layout responsivo

### Bibliotecas
- **bcryptjs** - Criptografia de senhas
- **exceljs** - Manipulação de arquivos Excel
- **nodemailer** - Envio de e-mails
- **pdfkit** - Geração de PDFs
- **winston** - Sistema de logs
- **node-cron** - Tarefas agendadas

## 📂 Estrutura do Projeto

```
erp-ecommerce-completo/
├── src/
│   ├── main/              # Backend Electron
│   │   ├── database/      # Banco de dados e migrations
│   │   ├── services/      # Lógica de negócio
│   │   └── handlers/      # IPC handlers
│   └── renderer/          # Frontend
│       ├── pages/         # Páginas do sistema
│       ├── css/           # Estilos
│       └── js/            # Scripts
├── ecommerce/             # E-commerce (API + Frontend)
├── data/                  # Dados e banco de dados
├── docs/                  # Documentação
└── package.json           # Dependências
```

## 🎨 Interface

O sistema possui uma interface moderna e intuitiva, inspirada no A7 Pharma, com:

- Menu lateral organizado por módulos
- Busca inteligente no menu
- Design responsivo
- Feedback visual de ações
- Tema profissional e limpo

## 📊 Banco de Dados

O sistema utiliza SQLite3 com 20 tabelas principais:

- usuarios, produtos, categorias
- clientes, fornecedores
- vendas, vendas_itens
- compras, compras_itens
- estoque, estoque_movimentacao
- financeiro_contas, financeiro_categorias
- nfe (Notas Fiscais)
- pedidos_ecommerce
- logs_sistema, backups
- tarefas_agendadas
- sincronizacao_log
- lgpd_consentimentos

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Autenticação obrigatória
- ✅ Controle de acesso por tipo de usuário
- ✅ Logs de auditoria
- ✅ Backup automático
- ✅ Conformidade com LGPD

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para ajudar pequenas e médias empresas a crescerem.

## 📞 Suporte

- 📧 E-mail: admin@sistema.com
- 🐛 Issues: [GitHub Issues](https://github.com/gustavoaraujo1201-lab/software-loja-erp-2.0.0/issues)

## 🗺️ Roadmap

- [x] Sistema ERP Desktop completo
- [x] Banco de dados e migrations
- [x] Interface moderna
- [x] Gestão de produtos, clientes e fornecedores
- [x] Controle de vendas e compras
- [x] Gestão de estoque
- [x] Módulo financeiro
- [ ] E-commerce completo (em desenvolvimento)
- [ ] Sincronização automática
- [ ] Emissão de NF-e (integração com API)
- [ ] App mobile

## ⭐ Agradecimentos

Obrigado por usar nosso sistema! Se você gostou, não esqueça de dar uma ⭐ no repositório!

---

**Versão:** 2.0.0  
**Última atualização:** 2026-02-13

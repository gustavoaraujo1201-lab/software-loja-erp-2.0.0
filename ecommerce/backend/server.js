/**
 * Servidor Express para E-commerce
 * API REST para integração com a loja online
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Importar rotas
const produtosRouter = require('./routes/produtos');
const pedidosRouter = require('./routes/pedidos');
const authRouter = require('./routes/auth');
const syncRouter = require('./routes/sync');

// Usar rotas
app.use('/api/produtos', produtosRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/auth', authRouter);
app.use('/api/sync', syncRouter);

// Rota inicial
app.get('/api', (req, res) => {
  res.json({
    nome: 'API E-commerce ERP',
    versao: '1.0.0',
    status: 'online'
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    erro: 'Erro interno do servidor',
    mensagem: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor E-commerce rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api`);
  console.log(`🛒 Loja disponível em http://localhost:${PORT}`);
});

module.exports = app;

/**
 * Rotas de Pedidos para E-commerce
 */
const express = require('express');
const router = express.Router();

// Listar pedidos
router.get('/', (req, res) => {
  res.json({
    pedidos: [],
    total: 0
  });
});

// Criar pedido
router.post('/', (req, res) => {
  const { cliente, itens, total } = req.body;
  
  // TODO: Salvar pedido e sincronizar com ERP
  res.json({
    sucesso: true,
    pedido_id: 1,
    mensagem: 'Pedido criado com sucesso'
  });
});

module.exports = router;

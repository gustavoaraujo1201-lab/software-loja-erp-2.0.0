/**
 * Rotas de Produtos para E-commerce
 */
const express = require('express');
const router = express.Router();

// Listar produtos
router.get('/', (req, res) => {
  // TODO: Buscar produtos do banco ERP via sincronização
  res.json({
    produtos: [],
    total: 0
  });
});

// Detalhes de um produto
router.get('/:id', (req, res) => {
  const { id } = req.params;
  // TODO: Buscar produto específico
  res.json({
    id: id,
    nome: 'Produto Exemplo',
    preco: 99.99,
    estoque: 10
  });
});

module.exports = router;

/**
 * Rotas de Autenticação
 */
const express = require('express');
const router = express.Router();

// Login de cliente
router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  
  // TODO: Implementar autenticação
  res.json({
    sucesso: true,
    token: 'example-token',
    cliente: {
      id: 1,
      nome: 'Cliente Exemplo',
      email: email
    }
  });
});

// Registro de cliente
router.post('/registro', (req, res) => {
  const { nome, email, senha } = req.body;
  
  // TODO: Criar cliente
  res.json({
    sucesso: true,
    mensagem: 'Cliente registrado com sucesso'
  });
});

module.exports = router;

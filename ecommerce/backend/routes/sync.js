/**
 * Rotas de Sincronização com ERP
 */
const express = require('express');
const router = express.Router();

// Status da sincronização
router.get('/status', (req, res) => {
  res.json({
    ultima_sinc: new Date().toISOString(),
    status: 'ok',
    produtos_sincronizados: 0,
    pedidos_pendentes: 0
  });
});

// Sincronizar produtos
router.post('/produtos', (req, res) => {
  // TODO: Sincronizar produtos do ERP
  res.json({
    sucesso: true,
    sincronizados: 0
  });
});

// Sincronizar pedidos
router.post('/pedidos', (req, res) => {
  // TODO: Enviar pedidos para ERP
  res.json({
    sucesso: true,
    importados: 0
  });
});

module.exports = router;

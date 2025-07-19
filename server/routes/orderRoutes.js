const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Rutas protegidas para usuarios
router.post('/', auth, createOrder);
router.get('/user', auth, getUserOrders);
router.get('/:id', auth, getOrderById);

// Rutas protegidas para admin
router.get('/', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, getAllOrders);
router.put('/:id/status', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, updateOrderStatus);

module.exports = router;
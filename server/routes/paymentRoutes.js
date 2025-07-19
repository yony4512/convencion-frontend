const express = require('express');
const router = express.Router();
const { createPayment, getUserPayments, getAllPayments, updatePaymentStatus } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Rutas protegidas para usuarios
router.post('/', auth, createPayment);
router.get('/user', auth, getUserPayments);

// Rutas protegidas para admin
router.get('/', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, getAllPayments);
router.put('/:id/status', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, updatePaymentStatus);

module.exports = router;
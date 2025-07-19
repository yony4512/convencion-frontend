const express = require('express');
const router = express.Router();
const { createTestimonial, getAllTestimonials, getPendingTestimonials, approveTestimonial } = require('../controllers/testimonialController');
const auth = require('../middleware/auth');

// Rutas públicas
router.get('/', getAllTestimonials);

// Rutas protegidas para usuarios
router.post('/', auth, createTestimonial);

// Rutas protegidas para admin
router.get('/pending', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, getPendingTestimonials);
router.put('/:id/approve', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, approveTestimonial);

module.exports = router;
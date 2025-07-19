const express = require('express');
const router = express.Router();
const { createReservation, getUserReservations, getReservationById, getAllReservations, updateReservationStatus } = require('../controllers/reservationController');
const auth = require('../middleware/auth');

// Rutas protegidas para usuarios
router.post('/', auth, createReservation);
router.get('/user', auth, getUserReservations);
router.get('/:id', auth, getReservationById);

// Rutas protegidas para admin
router.get('/', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, getAllReservations);
router.put('/:id/status', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, updateReservationStatus);

module.exports = router;
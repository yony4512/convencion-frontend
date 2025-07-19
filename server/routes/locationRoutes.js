const express = require('express');
const router = express.Router();
const { createLocation, getAllLocations, updateLocation, deleteLocation } = require('../controllers/locationController');
const auth = require('../middleware/auth');

// Rutas públicas
router.get('/', getAllLocations);

// Rutas protegidas para admin
router.post('/', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, createLocation);
router.put('/:id', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, updateLocation);
router.delete('/:id', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, deleteLocation);

module.exports = router;
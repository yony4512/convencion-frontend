const express = require('express');
const router = express.Router();
const { getUserActivityLogs, getAllActivityLogs } = require('../controllers/activityLogController');
const auth = require('../middleware/auth');

// Rutas protegidas para usuarios
router.get('/user', auth, getUserActivityLogs);

// Rutas protegidas para admin
router.get('/', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, getAllActivityLogs);

module.exports = router;
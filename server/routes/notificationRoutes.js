const express = require('express');
const router = express.Router();
const { createNotification, getUserNotifications, markAsRead } = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Rutas protegidas para usuarios
router.get('/user', auth, getUserNotifications);
router.put('/:id/read', auth, markAsRead);

// Rutas protegidas para admin
router.post('/', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}, createNotification);

module.exports = router;
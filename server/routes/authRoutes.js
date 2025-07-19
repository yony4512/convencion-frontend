const express = require('express');
const router = express.Router();
const passport = require('../middleware/googleAuth');

// Iniciar login con Google
router.get('/google/web', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback de Google
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: true
}), (req, res) => {
  // Redirige al frontend o envía datos del usuario
  res.redirect('http://localhost:5174'); // Ajusta la URL según tu frontend
});

// Obtener usuario autenticado
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ ok: true, user: req.user });
  } else {
    res.json({ ok: false, user: null });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5174/login');
  });
});

module.exports = router;
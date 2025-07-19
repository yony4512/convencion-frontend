const express = require('express');
const router = express.Router();
const { register, login, getUserProfile, updateUser } = require('../controllers/userController');
const auth = require('../middleware/auth');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUser);

module.exports = router;
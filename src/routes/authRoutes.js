const express = require('express');
const router = express.Router();
const { registerValidation, loginValidation, register, login, refresh } = require('../controllers/authController');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refresh);

module.exports = router;
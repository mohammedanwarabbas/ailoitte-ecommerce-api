const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const { registerUser, loginUser, refreshToken } = require('../services/authService');

const registerValidation = [
  body('name').optional().isString().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'customer']),
  handleValidationErrors,
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  handleValidationErrors,
];

const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body.email, req.body.password);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    const result = await refreshToken(token);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || 'Token refresh failed',
    });
  }
};

module.exports = {
  registerValidation,
  loginValidation,
  register,
  login,
  refresh,
};
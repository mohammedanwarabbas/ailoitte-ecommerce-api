const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  createOrderValidation,
  getOrderValidation,
  createOrder,
  getOrders,
  getOrder,
  updateStatus,
} = require('../controllers/orderController');

// All order routes require authentication
router.use(authenticate);

// Customer routes
router.post('/', authorizeRole('customer'), createOrderValidation, createOrder);
router.get('/', authorizeRole('customer'), getOrderValidation, getOrders);
router.get('/:id', authorizeRole('customer'), getOrder);

// Admin routes
router.put('/:id/status', authorizeRole('admin'), updateStatus);

module.exports = router;
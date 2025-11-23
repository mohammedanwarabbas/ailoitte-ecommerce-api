const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  addItemValidation,
  updateItemValidation,
  getCart,
  addItem,
  updateItem,
  removeItem,
  clear,
} = require('../controllers/cartController');

// All cart routes require authentication and are customer-only
router.use(authenticate);
router.use(authorizeRole('customer'));

// Cart routes
router.get('/', getCart);
router.post('/items', addItemValidation, addItem);
router.put('/items/:id', updateItemValidation, updateItem);
router.delete('/items/:id', removeItem);
router.delete('/clear', clear);

module.exports = router;
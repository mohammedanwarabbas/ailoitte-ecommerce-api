const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  createCategoryValidation,
  getCategoryValidation,
  create,
  getAll,
  getById,
  update,
  remove,
} = require('../controllers/categoryController');

// All category routes require authentication
router.use(authenticate);

// Admin-only routes
router.post('/', authorizeRole('admin'), createCategoryValidation, create);
router.put('/:id', authorizeRole('admin'), createCategoryValidation, update);
router.delete('/:id', authorizeRole('admin'), remove);

// Public routes (accessible to all authenticated users)
router.get('/', getCategoryValidation, getAll);
router.get('/:id', getById);

module.exports = router;
const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  upload,
  createProductValidation,
  getProductValidation,
  create,
  getAll,
  getById,
  update,
  remove,
} = require('../controllers/productController');

// All product routes require authentication
router.use(authenticate);

// Admin-only routes
router.post('/', authorizeRole('admin'), upload.single('image'), createProductValidation, create);
router.put('/:id', authorizeRole('admin'), upload.single('image'), createProductValidation, update);
router.delete('/:id', authorizeRole('admin'), remove);

// Public routes (accessible to all authenticated users)
router.get('/', getProductValidation, getAll);
router.get('/:id', getById);

module.exports = router;
const { body, query } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const { uploadImage } = require('../utils/cloudinary');
const multer = require('multer');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../services/productService');

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const createProductValidation = [
  body('name').isString().trim().notEmpty(),
  body('description').optional().isString().trim(),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  body('categoryId').isUUID(),
  handleValidationErrors,
];

const getProductValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('categoryId').optional().isUUID(),
  query('name').optional().isString().trim(),
  query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('sortField').optional().isString().trim(),
  query('sortDirection').optional().isIn(['asc', 'desc']),
  handleValidationErrors,
];

const create = async (req, res) => {
  try {
    // Handle image upload if file is provided
    if (req.file) {
      const imageResult = await uploadImage(req.file);
      req.body.imageUrl = imageResult.url;
    }

    const product = await createProduct(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

const getAll = async (req, res) => {
  try {
    const filters = {
      categoryId: req.query.categoryId,
      name: req.query.name,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
    };

    const sort = {
      field: req.query.sortField,
      direction: req.query.sortDirection,
    };

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const result = await getAllProducts(filters, page, limit, sort);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch products',
    });
  }
};

const getById = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch product',
    });
  }
};

const update = async (req, res) => {
  try {
    // Handle image upload if file is provided
    if (req.file) {
      const imageResult = await uploadImage(req.file);
      req.body.imageUrl = imageResult.url;
    }

    const product = await updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

const remove = async (req, res) => {
  try {
    const product = await deleteProduct(req.params.id);
    res.json({
      success: true,
      message: 'Product deleted successfully',
      product,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product',
    });
  }
};

module.exports = {
  upload,
  createProductValidation,
  getProductValidation,
  create,
  getAll,
  getById,
  update,
  remove,
};
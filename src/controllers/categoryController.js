const { body, query } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../services/categoryService');

const createCategoryValidation = [
  body('name').isString().trim().notEmpty(),
  body('description').optional().isString().trim(),
  handleValidationErrors,
];

const getCategoryValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  handleValidationErrors,
];

const create = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create category',
    });
  }
};

const getAll = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    
    const result = await getAllCategories(page, limit);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories',
    });
  }
};

const getById = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    res.json({
      success: true,
      category,
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
      message: error.message || 'Failed to fetch category',
    });
  }
};

const update = async (req, res) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.json({
      success: true,
      category,
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
      message: error.message || 'Failed to update category',
    });
  }
};

const remove = async (req, res) => {
  try {
    const category = await deleteCategory(req.params.id);
    res.json({
      success: true,
      message: 'Category deleted successfully',
      category,
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
      message: error.message || 'Failed to delete category',
    });
  }
};

module.exports = {
  createCategoryValidation,
  getCategoryValidation,
  create,
  getAll,
  getById,
  update,
  remove,
};
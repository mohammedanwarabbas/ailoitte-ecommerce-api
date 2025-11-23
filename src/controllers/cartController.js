const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const {
  getCartWithItems,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} = require('../services/cartService');

const addItemValidation = [
  body('productId').isUUID(),
  body('quantity').isInt({ min: 1 }),
  handleValidationErrors,
];

const updateItemValidation = [
  body('quantity').isInt({ min: 0 }),
  handleValidationErrors,
];

const getCart = async (req, res) => {
  try {
    const cart = await getCartWithItems(req.user.id);
    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch cart',
    });
  }
};

const addItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await addItemToCart(req.user.id, productId, quantity);
    res.status(201).json({
      success: true,
      cart,
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
      message: error.message || 'Failed to add item to cart',
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await updateCartItem(req.user.id, req.params.id, quantity);
    res.json({
      success: true,
      cart,
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
      message: error.message || 'Failed to update cart item',
    });
  }
};

const removeItem = async (req, res) => {
  try {
    const cart = await removeItemFromCart(req.user.id, req.params.id);
    res.json({
      success: true,
      cart,
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
      message: error.message || 'Failed to remove item from cart',
    });
  }
};

const clear = async (req, res) => {
  try {
    const cart = await clearCart(req.user.id);
    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to clear cart',
    });
  }
};

module.exports = {
  addItemValidation,
  updateItemValidation,
  getCart,
  addItem,
  updateItem,
  removeItem,
  clear,
};
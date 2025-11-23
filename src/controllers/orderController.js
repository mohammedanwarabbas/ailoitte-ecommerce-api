const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const {
  createOrderFromCart,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} = require('../services/orderService');

const createOrderValidation = [
  handleValidationErrors,
];

const getOrderValidation = [
  handleValidationErrors,
];

const createOrder = async (req, res) => {
  try {
    const order = await createOrderFromCart(req.user.id);
    res.status(201).json({
      success: true,
      order,
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
      message: error.message || 'Failed to create order',
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await getUserOrders(req.user.id);
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders',
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await getOrderById(req.params.id, req.user.id);
    res.json({
      success: true,
      order,
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
      message: error.message || 'Failed to fetch order',
    });
  }
};

// Admin-only function to update order status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);
    res.json({
      success: true,
      order,
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
      message: error.message || 'Failed to update order status',
    });
  }
};

module.exports = {
  createOrderValidation,
  getOrderValidation,
  createOrder,
  getOrders,
  getOrder,
  updateStatus,
};
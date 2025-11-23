const { Order, OrderItem, Cart, CartItem, Product } = require('../models');

const createOrderFromCart = async (userId) => {
  try {
    // Get user's active cart with items
    const cart = await Cart.findOne({
      where: {
        userId: userId,
        status: 'active',
      },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
        }],
      }],
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw { statusCode: 400, message: 'Cart is empty' };
    }

    // Calculate total price and prepare order items
    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of cart.items) {
      // Verify product still exists and has sufficient stock
      const product = await Product.findByPk(item.productId);
      if (!product || product.isDeleted) {
        throw { statusCode: 400, message: `Product ${item.product.name} is no longer available` };
      }

      if (product.stock < item.quantity) {
        throw { statusCode: 400, message: `Insufficient stock for ${product.name}` };
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      // Calculate item total
      const itemTotal = parseFloat(item.unitPrice) * item.quantity;
      totalPrice += itemTotal;

      // Prepare order item data (with price snapshot)
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        productName: item.product.name,
      });
    }

    // Create order
    const order = await Order.create({
      userId: userId,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      status: 'placed',
    });

    // Create order items
    for (const itemData of orderItemsData) {
      await OrderItem.create({
        ...itemData,
        orderId: order.id,
      });
    }

    // Mark cart as converted
    cart.status = 'converted';
    await cart.save();

    // Return order with items
    const orderWithItems = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
      }],
    });

    return orderWithItems;
  } catch (error) {
    throw error;
  }
};

const getUserOrders = async (userId) => {
  try {
    const orders = await Order.findAll({
      where: { userId: userId },
      include: [{
        model: OrderItem,
        as: 'items',
      }],
      order: [['createdAt', 'DESC']],
    });

    return orders;
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (orderId, userId) => {
  try {
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: userId,
      },
      include: [{
        model: OrderItem,
        as: 'items',
      }],
    });

    if (!order) {
      throw { statusCode: 404, message: 'Order not found' };
    }

    return order;
  } catch (error) {
    throw error;
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw { statusCode: 404, message: 'Order not found' };
    }

    order.status = status;
    await order.save();

    return order;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createOrderFromCart,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
};
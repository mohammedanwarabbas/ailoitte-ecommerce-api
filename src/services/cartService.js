const { Cart, CartItem, Product } = require('../models');

const getOrCreateCart = async (userId) => {
  try {
    // Find existing active cart
    let cart = await Cart.findOne({
      where: {
        userId: userId,
        status: 'active',
      },
    });

    // If no active cart exists, create one
    if (!cart) {
      cart = await Cart.create({
        userId: userId,
        status: 'active',
      });
    }

    return cart;
  } catch (error) {
    throw error;
  }
};

const getCartWithItems = async (userId) => {
  try {
    const cart = await getOrCreateCart(userId);
    
    const cartWithItems = await Cart.findByPk(cart.id, {
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price'],
        }],
      }],
    });

    // Calculate total price
    let totalPrice = 0;
    if (cartWithItems.items) {
      cartWithItems.items.forEach(item => {
        totalPrice += parseFloat(item.unitPrice) * item.quantity;
      });
    }

    return {
      ...cartWithItems.toJSON(),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    };
  } catch (error) {
    throw error;
  }
};

const addItemToCart = async (userId, productId, quantity) => {
  try {
    const cart = await getOrCreateCart(userId);
    
    // Check if product exists and has sufficient stock
    const product = await Product.findOne({
      where: { id: productId, isDeleted: false },
    });

    if (!product) {
      throw { statusCode: 404, message: 'Product not found' };
    }

    if (product.stock < quantity) {
      throw { statusCode: 400, message: 'Insufficient stock' };
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (cartItem) {
      // Update quantity and price
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new cart item with snapshot price
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
        unitPrice: product.price, // Snapshot price
      });
    }

    return await getCartWithItems(userId);
  } catch (error) {
    throw error;
  }
};

const updateCartItem = async (userId, cartItemId, quantity) => {
  try {
    const cart = await getOrCreateCart(userId);
    
    // Find the cart item
    const cartItem = await CartItem.findOne({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      include: [{
        model: Product,
        as: 'product',
      }],
    });

    if (!cartItem) {
      throw { statusCode: 404, message: 'Cart item not found' };
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await cartItem.destroy();
    } else {
      // Check stock availability
      if (cartItem.product.stock < quantity) {
        throw { statusCode: 400, message: 'Insufficient stock' };
      }
      
      // Update quantity
      cartItem.quantity = quantity;
      await cartItem.save();
    }

    return await getCartWithItems(userId);
  } catch (error) {
    throw error;
  }
};

const removeItemFromCart = async (userId, cartItemId) => {
  try {
    const cart = await getOrCreateCart(userId);
    
    // Find and delete the cart item
    const cartItem = await CartItem.findOne({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      throw { statusCode: 404, message: 'Cart item not found' };
    }

    await cartItem.destroy();
    return await getCartWithItems(userId);
  } catch (error) {
    throw error;
  }
};

const clearCart = async (userId) => {
  try {
    const cart = await getOrCreateCart(userId);
    
    // Delete all cart items
    await CartItem.destroy({
      where: {
        cartId: cart.id,
      },
    });

    return await getCartWithItems(userId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOrCreateCart,
  getCartWithItems,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
};

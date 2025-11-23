const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Associations
User.hasMany(Cart, {
  foreignKey: 'userId',
  as: 'carts'
});

Cart.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products'
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

Cart.hasMany(CartItem, {
  foreignKey: 'cartId',
  as: 'items'
});

CartItem.belongsTo(Cart, {
  foreignKey: 'cartId',
  as: 'cart'
});

Product.hasMany(CartItem, {
  foreignKey: 'productId',
  as: 'cartItems'
});

CartItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems'
});

OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// Add Op for queries
const { Op } = require('sequelize');

// Export models with associations
module.exports = {
  User,
  Category,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Op
};
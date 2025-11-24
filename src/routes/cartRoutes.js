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

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         userId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         status:
 *           type: string
 *           enum: [active, converted]
 *           example: "active"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         cartId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         productId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         quantity:
 *           type: integer
 *           example: 2
 *         unitPrice:
 *           type: number
 *           format: float
 *           example: 49.99
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "Smartphone"
 *         description:
 *           type: string
 *           example: "Latest smartphone with advanced features"
 *         price:
 *           type: number
 *           format: float
 *           example: 49.99
 *         stock:
 *           type: integer
 *           example: 100
 *         categoryId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         imageUrl:
 *           type: string
 *           example: "https://res.cloudinary.com/example/image/upload/product.jpg"
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     CartWithItems:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [active, converted]
 *         totalPrice:
 *           type: number
 *           format: float
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               cartId:
 *                 type: string
 *                 format: uuid
 *               productId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *               unitPrice:
 *                 type: number
 *                 format: float
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *               product:
 *                 $ref: '#/components/schemas/Product'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     AddCartItemRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 * 
 *     UpdateCartItemRequest:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           example: 3
 */

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management endpoints (Customer only)
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cart:
 *                   $ref: '#/components/schemas/CartWithItems'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not a customer
 *       500:
 *         description: Internal server error
 *     examples:
 *       success:
 *         summary: Cart with items
 *         value:
 *           success: true
 *           cart:
 *             id: "123e4567-e89b-12d3-a456-426614174000"
 *             userId: "123e4567-e89b-12d3-a456-426614174000"
 *             status: "active"
 *             totalPrice: 149.97
 *             createdAt: "2024-01-15T10:30:00.000Z"
 *             updatedAt: "2024-01-15T10:30:00.000Z"
 *             items:
 *               - id: "223e4567-e89b-12d3-a456-426614174000"
 *                 cartId: "123e4567-e89b-12d3-a456-426614174000"
 *                 productId: "323e4567-e89b-12d3-a456-426614174000"
 *                 quantity: 3
 *                 unitPrice: 49.99
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *                 product:
 *                   id: "323e4567-e89b-12d3-a456-426614174000"
 *                   name: "Smartphone"
 *                   description: "Latest smartphone"
 *                   price: 49.99
 *                   stock: 100
 *                   categoryId: "423e4567-e89b-12d3-a456-426614174000"
 *                   imageUrl: "https://res.cloudinary.com/example/image/upload/phone.jpg"
 *                   isDeleted: false
 *                   createdAt: "2024-01-15T10:30:00.000Z"
 *                   updatedAt: "2024-01-15T10:30:00.000Z"
 *       empty-cart:
 *         summary: Empty cart
 *         value:
 *           success: true
 *           cart:
 *             id: "123e4567-e89b-12d3-a456-426614174000"
 *             userId: "123e4567-e89b-12d3-a456-426614174000"
 *             status: "active"
 *             totalPrice: 0
 *             items: []
 *             createdAt: "2024-01-15T10:30:00.000Z"
 *             updatedAt: "2024-01-15T10:30:00.000Z"
 */
router.get('/', getCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCartItemRequest'
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cart:
 *                   $ref: '#/components/schemas/CartWithItems'
 *       400:
 *         description: Validation error or insufficient stock
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not a customer
 *       500:
 *         description: Internal server error
 */
router.post('/items', addItemValidation, addItem);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItemRequest'
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cart:
 *                   $ref: '#/components/schemas/CartWithItems'
 *       400:
 *         description: Validation error or insufficient stock
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not a customer
 *       500:
 *         description: Internal server error
 */
router.put('/items/:id', updateItemValidation, updateItem);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cart:
 *                   $ref: '#/components/schemas/CartWithItems'
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not a customer
 *       500:
 *         description: Internal server error
 */
router.delete('/items/:id', removeItem);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear all items from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cart:
 *                   $ref: '#/components/schemas/CartWithItems'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not a customer
 *       500:
 *         description: Internal server error
 */
router.delete('/clear', clear);

module.exports = router;
const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  createOrderValidation,
  getOrderValidation,
  createOrder,
  getOrders,
  getOrder,
  updateStatus,
} = require('../controllers/orderController');

// All order routes require authentication
router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
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
 *         totalPrice:
 *           type: number
 *           format: float
 *           example: 149.97
 *         status:
 *           type: string
 *           enum: [placed, shipped, delivered, cancelled]
 *           example: "placed"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "223e4567-e89b-12d3-a456-426614174000"
 *         orderId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         productId:
 *           type: string
 *           format: uuid
 *           example: "323e4567-e89b-12d3-a456-426614174000"
 *         quantity:
 *           type: integer
 *           example: 3
 *         unitPrice:
 *           type: number
 *           format: float
 *           example: 49.99
 *         productName:
 *           type: string
 *           example: "Smartphone"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     OrderWithItems:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         totalPrice:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           enum: [placed, shipped, delivered, cancelled]
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     UpdateOrderStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [placed, shipped, delivered, cancelled]
 *           example: "shipped"
 * 
 *     OrderResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         order:
 *           $ref: '#/components/schemas/OrderWithItems'
 * 
 *     OrdersListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderWithItems'
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

// Customer routes

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create order from cart (Customer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully from cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Cart is empty, insufficient stock, or product unavailable
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not a customer
 *       500:
 *         description: Internal server error
 *     examples:
 *       success:
 *         summary: Order created from cart
 *         value:
 *           success: true
 *           order:
 *             id: "123e4567-e89b-12d3-a456-426614174000"
 *             userId: "123e4567-e89b-12d3-a456-426614174000"
 *             totalPrice: 149.97
 *             status: "placed"
 *             createdAt: "2024-01-15T10:30:00.000Z"
 *             updatedAt: "2024-01-15T10:30:00.000Z"
 *             items:
 *               - id: "223e4567-e89b-12d3-a456-426614174000"
 *                 orderId: "123e4567-e89b-12d3-a456-426614174000"
 *                 productId: "323e4567-e89b-12d3-a456-426614174000"
 *                 quantity: 3
 *                 unitPrice: 49.99
 *                 productName: "Smartphone"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *       empty-cart:
 *         summary: Empty cart error
 *         value:
 *           success: false
 *           message: "Cart is empty"
 *       insufficient-stock:
 *         summary: Insufficient stock
 *         value:
 *           success: false
 *           message: "Insufficient stock for Smartphone"
 */
router.post('/', authorizeRole('customer'), createOrderValidation, createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's orders (Customer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersListResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not a customer
 *       500:
 *         description: Internal server error
 *     examples:
 *       success:
 *         summary: User's order history
 *         value:
 *           success: true
 *           orders:
 *             - id: "123e4567-e89b-12d3-a456-426614174000"
 *               userId: "123e4567-e89b-12d3-a456-426614174000"
 *               totalPrice: 149.97
 *               status: "delivered"
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
 *               items:
 *                 - id: "223e4567-e89b-12d3-a456-426614174000"
 *                   orderId: "123e4567-e89b-12d3-a456-426614174000"
 *                   productId: "323e4567-e89b-12d3-a456-426614174000"
 *                   quantity: 3
 *                   unitPrice: 49.99
 *                   productName: "Smartphone"
 *                   createdAt: "2024-01-15T10:30:00.000Z"
 *                   updatedAt: "2024-01-15T10:30:00.000Z"
 *             - id: "423e4567-e89b-12d3-a456-426614174000"
 *               userId: "123e4567-e89b-12d3-a456-426614174000"
 *               totalPrice: 29.99
 *               status: "placed"
 *               createdAt: "2024-01-14T15:20:00.000Z"
 *               updatedAt: "2024-01-14T15:20:00.000Z"
 *               items:
 *                 - id: "523e4567-e89b-12d3-a456-426614174000"
 *                   orderId: "423e4567-e89b-12d3-a456-426614174000"
 *                   productId: "623e4567-e89b-12d3-a456-426614174000"
 *                   quantity: 1
 *                   unitPrice: 29.99
 *                   productName: "Headphones"
 *                   createdAt: "2024-01-14T15:20:00.000Z"
 *                   updatedAt: "2024-01-14T15:20:00.000Z"
 */
router.get('/', authorizeRole('customer'), getOrderValidation, getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get specific order by ID (Customer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not a customer
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authorizeRole('customer'), getOrder);

// Admin routes

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateOrderStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [placed, shipped, delivered, cancelled]
 *           example: "shipped"
 *           description: New order status
 */

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [placed, shipped, delivered, cancelled]
 *                 example: "shipped"
 *                 description: |
 *                   Available status values:
 *                   - placed
 *                   - shipped  
 *                   - delivered
 *                   - cancelled
 *           examples:
 *             shipped:
 *               summary: Update to shipped
 *               value:
 *                 status: "shipped"
 *             delivered:
 *               summary: Update to delivered
 *               value:
 *                 status: "delivered"
 *             cancelled:
 *               summary: Update to cancelled
 *               value:
 *                 status: "cancelled"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an admin
 *       500:
 *         description: Internal server error
 *     examples:
 *       success:
 *         summary: Status updated to shipped
 *         value:
 *           success: true
 *           order:
 *             id: "123e4567-e89b-12d3-a456-426614174000"
 *             userId: "123e4567-e89b-12d3-a456-426614174000"
 *             totalPrice: 149.97
 *             status: "shipped"
 *             createdAt: "2024-01-15T10:30:00.000Z"
 *             updatedAt: "2024-01-15T11:45:00.000Z"
 *       invalid-status:
 *         summary: Invalid status provided
 *         value:
 *           success: false
 *           message: "Invalid status value. Must be one of: placed, shipped, delivered, cancelled"
 */
router.put('/:id/status', authorizeRole('admin'), updateStatus);

module.exports = router;
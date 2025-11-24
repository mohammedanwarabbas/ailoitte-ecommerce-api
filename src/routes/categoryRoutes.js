const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  createCategoryValidation,
  getCategoryValidation,
  create,
  getAll,
  getById,
  update,
  remove,
} = require('../controllers/categoryController');

// All category routes require authentication
router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "Electronics"
 *         description:
 *           type: string
 *           example: "Electronic devices and accessories"
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 * 
 *     CreateCategoryRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Electronics"
 *         description:
 *           type: string
 *           example: "Electronic devices and accessories"
 * 
 *     UpdateCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Updated Electronics"
 *         description:
 *           type: string
 *           example: "Updated description"
 * 
 *     CategoriesListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         totalPages:
 *           type: integer
 *           example: 5
 *         currentPage:
 *           type: integer
 *           example: 1
 *         totalCategories:
 *           type: integer
 *           example: 48
 * 
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         category:
 *           $ref: '#/components/schemas/Category'
 * 
 *     DeleteCategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Category deleted successfully"
 *         category:
 *           $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */

// Admin-only routes

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an admin
 *       500:
 *         description: Internal server error
 *     examples:
 *       success:
 *         summary: Category created
 *         value:
 *           success: true
 *           category:
 *             id: "123e4567-e89b-12d3-a456-426614174000"
 *             name: "Electronics"
 *             description: "Electronic devices and accessories"
 *             isDeleted: false
 *             createdAt: "2024-01-15T10:30:00.000Z"
 *             updatedAt: "2024-01-15T10:30:00.000Z"
 *       validation-error:
 *         summary: Validation failed
 *         value:
 *           success: false
 *           message: "Validation failed"
 *           errors:
 *             - msg: "name is required"
 *               param: "name"
 */
router.post('/', authorizeRole('admin'), createCategoryValidation, create);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryRequest'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an admin
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authorizeRole('admin'), createCategoryValidation, update);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteCategoryResponse'
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an admin
 *       500:
 *         description: Internal server error
 *     examples:
 *       success:
 *         summary: Category soft deleted
 *         value:
 *           success: true
 *           message: "Category deleted successfully"
 *           category:
 *             id: "123e4567-e89b-12d3-a456-426614174000"
 *             name: "Electronics"
 *             description: "Electronic devices"
 *             isDeleted: true
 *             deletedAt: "2024-01-15T10:30:00.000Z"
 *             createdAt: "2024-01-15T10:30:00.000Z"
 *             updatedAt: "2024-01-15T10:30:00.000Z"
 */
router.delete('/:id', authorizeRole('admin'), remove);

// Public routes (accessible to all authenticated users)

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories with pagination
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of categories per page
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriesListResponse'
 *       400:
 *         description: Validation error in query parameters
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *     examples:
 *       success:
 *         summary: Paginated categories list
 *         value:
 *           success: true
 *           categories:
 *             - id: "123e4567-e89b-12d3-a456-426614174000"
 *               name: "Electronics"
 *               description: "Electronic devices"
 *               isDeleted: false
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
 *             - id: "223e4567-e89b-12d3-a456-426614174000"
 *               name: "Clothing"
 *               description: "Fashion and apparel"
 *               isDeleted: false
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
 *           totalPages: 5
 *           currentPage: 1
 *           totalCategories: 48
 */
router.get('/', getCategoryValidation, getAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getById);

module.exports = router;
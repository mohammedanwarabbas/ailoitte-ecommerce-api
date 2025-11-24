const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  upload,
  createProductValidation,
  getProductValidation,
  create,
  getAll,
  getById,
  update,
  remove,
} = require('../controllers/productController');

// All product routes require authentication
router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
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
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 * 
 *     ProductWithCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         stock:
 *           type: integer
 *         categoryId:
 *           type: string
 *           format: uuid
 *         imageUrl:
 *           type: string
 *         isDeleted:
 *           type: boolean
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           example: "Smartphone"
 *         description:
 *           type: string
 *           example: "Latest smartphone with advanced features"
 *         price:
 *           type: number
 *           format: float
 *           minimum: 0
 *           example: 49.99
 *         stock:
 *           type: integer
 *           minimum: 0
 *           example: 100
 *         categoryId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 * 
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Updated Smartphone"
 *         description:
 *           type: string
 *           example: "Updated description"
 *         price:
 *           type: number
 *           format: float
 *           minimum: 0
 *           example: 59.99
 *         stock:
 *           type: integer
 *           minimum: 0
 *           example: 150
 *         categoryId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 * 
 *     ProductsListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductWithCategory'
 *         totalPages:
 *           type: integer
 *           example: 5
 *         currentPage:
 *           type: integer
 *           example: 1
 *         totalProducts:
 *           type: integer
 *           example: 48
 * 
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         product:
 *           $ref: '#/components/schemas/ProductWithCategory'
 * 
 *     DeleteProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Product deleted successfully"
 *         product:
 *           $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints with Cloudinary image upload
 */

// Admin-only routes

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product with image upload (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Smartphone"
 *               description:
 *                 type: string
 *                 example: "Latest smartphone with advanced features"
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 49.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 100
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image file (max 5MB, jpg, jpeg, png, webp)
 *     responses:
 *       201:
 *         description: Product created successfully with image
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Validation error or invalid image
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an admin
 *       500:
 *         description: Internal server error or Cloudinary upload failed
 *     examples:
 *       success:
 *         summary: Product created with image
 *         value:
 *           success: true
 *           product:
 *             id: "123e4567-e89b-12d3-a456-426614174000"
 *             name: "Smartphone"
 *             description: "Latest smartphone with advanced features"
 *             price: 49.99
 *             stock: 100
 *             categoryId: "223e4567-e89b-12d3-a456-426614174000"
 *             imageUrl: "https://res.cloudinary.com/example/image/upload/product.jpg"
 *             isDeleted: false
 *             createdAt: "2024-01-15T10:30:00.000Z"
 *             updatedAt: "2024-01-15T10:30:00.000Z"
 *             category:
 *               id: "223e4567-e89b-12d3-a456-426614174000"
 *               name: "Electronics"
 *       invalid-image:
 *         summary: Invalid image file
 *         value:
 *           success: false
 *           message: "Only image files are allowed"
 */
router.post('/', authorizeRole('admin'), upload.single('image'),createProductValidation,  create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product with optional image upload (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Smartphone"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 59.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 150
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image file (max 5MB, jpg, jpeg, png, webp)
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Validation error or invalid image
 *       404:
 *         description: Product or category not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an admin
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authorizeRole('admin'), upload.single('image'), createProductValidation, update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteProductResponse'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an admin
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authorizeRole('admin'), remove);

// Public routes (accessible to all authenticated users)

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products with advanced filtering and pagination
 *     tags: [Products]
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
 *         description: Number of products per page
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category ID
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by product name (case-insensitive)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *           minimum: 0
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *           minimum: 0
 *         description: Maximum price filter
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *           enum: [name, price, createdAt, stock]
 *         description: Field to sort by
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Products retrieved successfully with filters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsListResponse'
 *       400:
 *         description: Validation error in query parameters
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *     examples:
 *       filtered:
 *         summary: Filtered products by category and price
 *         value:
 *           success: true
 *           products:
 *             - id: "123e4567-e89b-12d3-a456-426614174000"
 *               name: "Smartphone"
 *               description: "Latest smartphone"
 *               price: 49.99
 *               stock: 100
 *               categoryId: "223e4567-e89b-12d3-a456-426614174000"
 *               imageUrl: "https://res.cloudinary.com/example/image/upload/phone.jpg"
 *               isDeleted: false
 *               category:
 *                 id: "223e4567-e89b-12d3-a456-426614174000"
 *                 name: "Electronics"
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
 *           totalPages: 3
 *           currentPage: 1
 *           totalProducts: 25
 */
router.get('/', getProductValidation, getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getById);

module.exports = router;
'use strict';

// Mock the product service
jest.mock('../src/services/productService');

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../src/services/productService');

describe('Product Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const mockProduct = { id: '1', name: 'Test Product' };
      createProduct.mockResolvedValue(mockProduct);

      const result = await createProduct({ name: 'Test Product' });
      
      expect(result).toEqual(mockProduct);
      expect(createProduct).toHaveBeenCalledWith({ name: 'Test Product' });
    });
  });

  describe('getAllProducts', () => {
    it('should retrieve all products', async () => {
      const mockProducts = {
        products: [{ id: '1', name: 'Product 1' }],
        totalProducts: 1,
        totalPages: 1,
        currentPage: 1
      };
      getAllProducts.mockResolvedValue(mockProducts);

      const result = await getAllProducts({}, 1, 10);
      
      expect(result).toEqual(mockProducts);
      expect(getAllProducts).toHaveBeenCalledWith({}, 1, 10);
    });
  });

  describe('getProductById', () => {
    it('should retrieve product by ID successfully', async () => {
      const mockProduct = { id: '1', name: 'Test Product' };
      getProductById.mockResolvedValue(mockProduct);

      const result = await getProductById('1');
      
      expect(result).toEqual(mockProduct);
      expect(getProductById).toHaveBeenCalledWith('1');
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const mockProduct = { id: '1', name: 'Updated Product' };
      updateProduct.mockResolvedValue(mockProduct);

      const result = await updateProduct('1', { name: 'Updated Product' });
      
      expect(result).toEqual(mockProduct);
      expect(updateProduct).toHaveBeenCalledWith('1', { name: 'Updated Product' });
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete product successfully', async () => {
      const mockProduct = { id: '1', isDeleted: true };
      deleteProduct.mockResolvedValue(mockProduct);

      const result = await deleteProduct('1');
      
      expect(result).toEqual(mockProduct);
      expect(deleteProduct).toHaveBeenCalledWith('1');
    });
  });
});


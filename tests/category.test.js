'use strict';

// Mock the category service
jest.mock('../src/services/categoryService');

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../src/services/categoryService');

describe('Category Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a new category successfully', async () => {
      const mockCategory = { id: '1', name: 'Test Category' };
      createCategory.mockResolvedValue(mockCategory);

      const result = await createCategory({ name: 'Test Category' });
      
      expect(result).toEqual(mockCategory);
      expect(createCategory).toHaveBeenCalledWith({ name: 'Test Category' });
    });
  });

  describe('getAllCategories', () => {
    it('should retrieve all categories', async () => {
      const mockCategories = {
        categories: [{ id: '1', name: 'Category 1' }],
        totalPages: 1,
        totalCount: 1,
        currentPage: 1
      };
      getAllCategories.mockResolvedValue(mockCategories);

      const result = await getAllCategories(1, 10);
      
      expect(result).toEqual(mockCategories);
      expect(getAllCategories).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getCategoryById', () => {
    it('should retrieve a category by ID', async () => {
      const mockCategory = { id: '1', name: 'Test Category' };
      getCategoryById.mockResolvedValue(mockCategory);

      const result = await getCategoryById('1');
      
      expect(result).toEqual(mockCategory);
      expect(getCategoryById).toHaveBeenCalledWith('1');
    });
  });

  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
      const mockCategory = { id: '1', name: 'Updated Category' };
      updateCategory.mockResolvedValue(mockCategory);

      const result = await updateCategory('1', { name: 'Updated Category' });
      
      expect(result).toEqual(mockCategory);
      expect(updateCategory).toHaveBeenCalledWith('1', { name: 'Updated Category' });
    });
  });

  describe('deleteCategory', () => {
    it('should mark a category as deleted', async () => {
      const mockCategory = { id: '1', isDeleted: true };
      deleteCategory.mockResolvedValue(mockCategory);

      const result = await deleteCategory('1');
      
      expect(result).toEqual(mockCategory);
      expect(deleteCategory).toHaveBeenCalledWith('1');
    });
  });
});

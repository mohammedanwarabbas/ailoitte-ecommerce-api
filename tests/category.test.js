const { Category } = require('../src/models');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../src/services/categoryService');
const sequelize = require('../src/config/database');

describe('Category Service', () => {
  beforeAll(async () => {
    // Sync the database
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  describe('createCategory', () => {
    it('should create a new category successfully', async () => {
      const categoryData = {
        name: 'Test Category',
        description: 'Test category description',
      };

      const category = await createCategory(categoryData);

      expect(category.name).toBe(categoryData.name);
      expect(category.description).toBe(categoryData.description);
      expect(category.isDeleted).toBe(false);
    });
  });

  describe('getAllCategories', () => {
    beforeEach(async () => {
      // Create some test categories
      await Category.bulkCreate([
        { name: 'Category 1', description: 'Description 1' },
        { name: 'Category 2', description: 'Description 2' },
        { name: 'Category 3', description: 'Description 3' },
      ]);
    });

    it('should retrieve all categories with pagination', async () => {
      const result = await getAllCategories(1, 2);

      expect(result.categories).toHaveLength(2);
      expect(result.totalPages).toBe(2);
      expect(result.currentPage).toBe(1);
      expect(result.totalCategories).toBe(3);
    });
  });

  describe('getCategoryById', () => {
    let categoryId;

    beforeEach(async () => {
      const category = await Category.create({
        name: 'Test Category',
        description: 'Test description',
      });
      categoryId = category.id;
    });

    it('should retrieve a category by ID', async () => {
      const category = await getCategoryById(categoryId);

      expect(category.id).toBe(categoryId);
      expect(category.name).toBe('Test Category');
    });

    it('should throw an error for non-existent category', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await expect(getCategoryById(nonExistentId)).rejects.toThrow();
    });
  });

  describe('updateCategory', () => {
    let categoryId;

    beforeEach(async () => {
      const category = await Category.create({
        name: 'Original Name',
        description: 'Original description',
      });
      categoryId = category.id;
    });

    it('should update a category successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        description: 'Updated description',
      };

      const updatedCategory = await updateCategory(categoryId, updateData);

      expect(updatedCategory.name).toBe(updateData.name);
      expect(updatedCategory.description).toBe(updateData.description);
    });
  });

  describe('deleteCategory', () => {
    let categoryId;

    beforeEach(async () => {
      const category = await Category.create({
        name: 'Category to delete',
        description: 'Description',
      });
      categoryId = category.id;
    });

    it('should mark a category as deleted', async () => {
      const deletedCategory = await deleteCategory(categoryId);

      expect(deletedCategory.isDeleted).toBe(true);
      expect(deletedCategory.deletedAt).toBeDefined();
    });
  });
});
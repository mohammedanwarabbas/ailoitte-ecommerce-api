const { Category } = require('../models');

const createCategory = async (categoryData) => {
  try {
    const category = await Category.create(categoryData);
    return category;
  } catch (error) {
    throw error;
  }
};

const getAllCategories = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await Category.findAndCountAll({
      where: { isDeleted: false },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      categories: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalCategories: count,
    };
  } catch (error) {
    throw error;
  }
};

const getCategoryById = async (id) => {
  try {
    const category = await Category.findOne({
      where: { id, isDeleted: false },
    });

    if (!category) {
      throw { statusCode: 404, message: 'Category not found' };
    }

    return category;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (id, categoryData) => {
  try {
    const category = await getCategoryById(id);
    await category.update(categoryData);
    return category;
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    const category = await getCategoryById(id);
    category.isDeleted = true;
    category.deletedAt = new Date();
    await category.save();
    return category;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

const { Product, Category, Op } = require('../models');

const createProduct = async (productData) => {
  try {
    // Check if category exists
    const category = await Category.findOne({
      where: { id: productData.categoryId, isDeleted: false },
    });

    if (!category) {
      throw { statusCode: 404, message: 'Category not found' };
    }

    const product = await Product.create(productData);
    return product;
  } catch (error) {
    throw error;
  }
};

const getAllProducts = async (filters = {}, page = 1, limit = 10, sort = {}) => {
  try {
    const offset = (page - 1) * limit;
    const whereClause = { isDeleted: false };
    
    // Apply filters
    if (filters.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }
    
    if (filters.name) {
      whereClause.name = {
        [Op.iLike]: `%${filters.name}%`,
      };
    }
    
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      whereClause.price = {};
      if (filters.minPrice !== undefined) {
        whereClause.price[Op.gte] = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        whereClause.price[Op.lte] = filters.maxPrice;
      }
    }

    // Apply sorting
    const order = [];
    if (sort.field && sort.direction) {
      order.push([sort.field, sort.direction.toUpperCase()]);
    } else {
      order.push(['createdAt', 'DESC']);
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      include: [{
        model: Category,
        as: 'category',
        where: { isDeleted: false },
        attributes: ['id', 'name'],
      }],
      limit,
      offset,
      order,
    });

    return {
      products: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count,
    };
  } catch (error) {
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const product = await Product.findOne({
      where: { id, isDeleted: false },
      include: [{
        model: Category,
        as: 'category',
        where: { isDeleted: false },
        attributes: ['id', 'name'],
      }],
    });

    if (!product) {
      throw { statusCode: 404, message: 'Product not found' };
    }

    return product;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (id, productData) => {
  try {
    const product = await getProductById(id);
    
    // If category is being updated, check if it exists
    if (productData.categoryId && productData.categoryId !== product.categoryId) {
      const category = await Category.findOne({
        where: { id: productData.categoryId, isDeleted: false },
      });

      if (!category) {
        throw { statusCode: 404, message: 'Category not found' };
      }
    }

    await product.update(productData);
    return product;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const product = await getProductById(id);
    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();
    return product;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

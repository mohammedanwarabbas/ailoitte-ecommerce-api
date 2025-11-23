'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // First, get the category IDs
    const categories = await queryInterface.sequelize.query(
      `SELECT id FROM "Categories" WHERE name IN ('Electronics', 'Clothing', 'Books', 'Home & Kitchen')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (categories.length < 4) {
      throw new Error('Categories not found. Please run category seeder first.');
    }

    await queryInterface.bulkInsert('Products', [
      {
        id: Sequelize.UUIDV4,
        name: 'Smartphone',
        description: 'Latest model smartphone with advanced features',
        price: 699.99,
        stock: 50,
        categoryId: categories[0].id, // Electronics
        imageUrl: 'https://placehold.co/800x600?text=Smartphone',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.UUIDV4,
        name: 'Laptop',
        description: 'High-performance laptop for work and gaming',
        price: 1299.99,
        stock: 30,
        categoryId: categories[0].id, // Electronics
        imageUrl: 'https://placehold.co/800x600?text=Laptop',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.UUIDV4,
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        stock: 100,
        categoryId: categories[1].id, // Clothing
        imageUrl: 'https://placehold.co/800x600?text=T-Shirt',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.UUIDV4,
        name: 'JavaScript Guide',
        description: 'Comprehensive guide to JavaScript programming',
        price: 39.99,
        stock: 75,
        categoryId: categories[2].id, // Books
        imageUrl: 'https://placehold.co/800x600?text=JavaScript+Guide',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.UUIDV4,
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with timer',
        price: 89.99,
        stock: 25,
        categoryId: categories[3].id, // Home & Kitchen
        imageUrl: 'https://placehold.co/800x600?text=Coffee+Maker',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};

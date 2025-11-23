'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface) {
    require('dotenv').config();
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);

    await queryInterface.bulkInsert('Users', [{
      id: uuidv4(),                               // ✅ real UUID value
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@ecommerce.com',
      password: hashedPassword,
      role: 'admin',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down (queryInterface) {
    require('dotenv').config();
    await queryInterface.bulkDelete('Users', {
      email: process.env.ADMIN_EMAIL || 'admin@ecommerce.com'
    }, {});
  }
};

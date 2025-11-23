// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'ecommerce_db_test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';

// Load dotenv
require('dotenv').config({ path: '.env.test' });
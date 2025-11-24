const { User } = require('../src/models');
const { registerUser, loginUser } = require('../src/services/authService');
const { hashPassword } = require('../src/utils/password');
const sequelize = require('../src/config/database');

describe('Auth Service', () => {
  beforeAll(async () => {
    // Sync the database
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
      };

      const result = await registerUser(userData);

      expect(result.success).toBe(true);
      expect(result.user.name).toBe(userData.name);
      expect(result.user.email).toBe(userData.email);
      expect(result.user.role).toBe(userData.role);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      // Verify user was saved to database
      const user = await User.findOne({ where: { email: userData.email } });
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
    });

    it('should fail to register a user with existing email', async () => {
      const userData = {
        name: 'Test User 2',
        email: 'test@example.com', // Same email as previous test
        password: 'password123',
        role: 'customer',
      };

      await expect(registerUser(userData)).rejects.toThrow();
    });
  });

  describe('loginUser', () => {
    it('should login a user successfully with correct credentials', async () => {
      const email = 'login@test.com';
      const password = 'password123';

      // Create a user first
      const hashedPassword = await hashPassword(password);
      await User.create({
        name: 'Login Test User',
        email,
        password: hashedPassword,
        role: 'customer',
      });

      const result = await loginUser(email, password);

      expect(result.success).toBe(true);
      expect(result.user.email).toBe(email);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should fail to login with incorrect password', async () => {
      const email = 'faillogin@test.com';
      const password = 'password123';
      const wrongPassword = 'wrongpassword';

      // Create a user first
      const hashedPassword = await hashPassword(password);
      await User.create({
        name: 'Fail Login Test User',
        email,
        password: hashedPassword,
        role: 'customer',
      });

      // Check that login fails with proper error response
      try {
        await loginUser(email, wrongPassword);
        // If we reach here, login didn't throw as expected
        fail('Login should have failed with incorrect password');
      } catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe('Invalid credentials');
      }
    });

    it('should fail to login with non-existent user', async () => {
      const email = 'nonexistent@test.com';
      const password = 'password123';

      // Check that login fails with proper error response
      try {
        await loginUser(email, password);
        // If we reach here, login didn't throw as expected
        fail('Login should have failed with non-existent user');
      } catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe('Invalid credentials');
      }
    });
  });
});
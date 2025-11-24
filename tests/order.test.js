'use strict';

// Mock the order service
jest.mock('../src/services/orderService');

const {
  createOrderFromCart,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} = require('../src/services/orderService');

describe('Order Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createOrderFromCart', () => {
    it('should create order from cart successfully', async () => {
      const mockOrder = { id: '1', userId: '1', status: 'placed' };
      createOrderFromCart.mockResolvedValue(mockOrder);

      const result = await createOrderFromCart('1');
      
      expect(result).toEqual(mockOrder);
      expect(createOrderFromCart).toHaveBeenCalledWith('1');
    });
  });

  describe('getUserOrders', () => {
    it('should retrieve user orders successfully', async () => {
      const mockOrders = [{ id: '1', userId: '1' }];
      getUserOrders.mockResolvedValue(mockOrders);

      const result = await getUserOrders('1');
      
      expect(result).toEqual(mockOrders);
      expect(getUserOrders).toHaveBeenCalledWith('1');
    });
  });

  describe('getOrderById', () => {
    it('should retrieve order by ID for the correct user', async () => {
      const mockOrder = { id: '1', userId: '1' };
      getOrderById.mockResolvedValue(mockOrder);

      const result = await getOrderById('1', '1');
      
      expect(result).toEqual(mockOrder);
      expect(getOrderById).toHaveBeenCalledWith('1', '1');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const mockOrder = { id: '1', status: 'shipped' };
      updateOrderStatus.mockResolvedValue(mockOrder);

      const result = await updateOrderStatus('1', 'shipped');
      
      expect(result).toEqual(mockOrder);
      expect(updateOrderStatus).toHaveBeenCalledWith('1', 'shipped');
    });
  });
});
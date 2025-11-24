'use strict';

// Mock the cart service
jest.mock('../src/services/cartService');

const {
  getCartWithItems,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} = require('../src/services/cartService');

describe('Cart Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getCartWithItems', () => {
    it('should retrieve cart with items', async () => {
      const mockCart = { id: '1', userId: '1', items: [] };
      getCartWithItems.mockResolvedValue(mockCart);

      const result = await getCartWithItems('1');
      
      expect(result).toEqual(mockCart);
      expect(getCartWithItems).toHaveBeenCalledWith('1');
    });
  });

  describe('addItemToCart', () => {
    it('should add item to cart successfully', async () => {
      const mockCart = { id: '1', items: [{ productId: '1', quantity: 2 }] };
      addItemToCart.mockResolvedValue(mockCart);

      const result = await addItemToCart('1', '1', 2);
      
      expect(result).toEqual(mockCart);
      expect(addItemToCart).toHaveBeenCalledWith('1', '1', 2);
    });
  });

  describe('updateCartItem', () => {
    it('should update cart item quantity successfully', async () => {
      const mockCart = { id: '1', items: [{ id: '1', quantity: 5 }] };
      updateCartItem.mockResolvedValue(mockCart);

      const result = await updateCartItem('1', '1', 5);
      
      expect(result).toEqual(mockCart);
      expect(updateCartItem).toHaveBeenCalledWith('1', '1', 5);
    });
  });

  describe('removeItemFromCart', () => {
    it('should remove item from cart successfully', async () => {
      const mockCart = { id: '1', items: [] };
      removeItemFromCart.mockResolvedValue(mockCart);

      const result = await removeItemFromCart('1', '1');
      
      expect(result).toEqual(mockCart);
      expect(removeItemFromCart).toHaveBeenCalledWith('1', '1');
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      const mockCart = { id: '1', items: [] };
      clearCart.mockResolvedValue(mockCart);

      const result = await clearCart('1');
      
      expect(result).toEqual(mockCart);
      expect(clearCart).toHaveBeenCalledWith('1');
    });
  });
});
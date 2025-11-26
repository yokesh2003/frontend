import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { cartService } from '../services/cartService';
import { CartItem } from '../types/Cart';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (audioId: number) => Promise<void>;
  removeFromCart: (audioId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const refreshCart = useCallback(async (): Promise<void> => {
    if (!user) {
      setCartItems([]);
      return;
    }
    try {
      const cart = await cartService.viewCart(user.customerId);
      setCartItems(cart?.cartItems ?? []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (audioId: number) => {
    if (!user) {
      throw new Error('Please log in to manage your cart.');
    }
    try {
      const cart = await cartService.addToCart(user.customerId, audioId);
      setCartItems(cart?.cartItems ?? []);
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (audioId: number) => {
    if (!user) {
      throw new Error('Please log in to manage your cart.');
    }
    try {
      const cart = await cartService.removeFromCart(user.customerId, audioId);
      setCartItems(cart?.cartItems ?? []);
    } catch (error) {
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        refreshCart,
        cartCount: cartItems.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};


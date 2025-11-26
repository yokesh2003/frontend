import { Cart } from '../types/Cart';
import api from './api';

export const cartService = {
  viewCart: async (customerId: number): Promise<Cart> => {
    const response = await api.get<Cart>(`/api/carts/${customerId}`);
    return response.data;
  },

  addToCart: async (customerId: number, audioId: number): Promise<Cart> => {
    const response = await api.post<Cart>(`/api/carts/${customerId}/add/${audioId}`);
    return response.data;
  },

  removeFromCart: async (customerId: number, audioId: number): Promise<Cart> => {
    const response = await api.delete<Cart>(`/api/carts/${customerId}/remove/${audioId}`);
    return response.data;
  },
};


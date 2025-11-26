import api from './api';

export const orderService = {
  placeOrder: async (customerId: number, paymentMethod: string, cvv: string) => {
    const response = await api.post(`/api/orders/${customerId}/place`, {
      paymentMethod,
      cvv,
    });
    return response.data;
  },
};


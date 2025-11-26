import { PaymentCard, PaymentRequest } from '../types/Payment';
import api from './api';

export const paymentService = {
  addCard: async (data: PaymentRequest): Promise<PaymentCard> => {
    const response = await api.post<PaymentCard>('/api/payment-cards', data);
    return response.data;
  },

  getSavedCards: async (customerId: number): Promise<PaymentCard[]> => {
    const response = await api.get<PaymentCard[]>(`/api/payment-cards/customer/${customerId}`);
    return response.data;
  },

  deleteCard: async (cardId: number): Promise<void> => {
    await api.delete(`/api/payment-cards/${cardId}`);
  },
};


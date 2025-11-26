import { ChangePasswordRequest, Customer, ForgotPasswordRequest, LoginRequest, RegisterRequest } from '../types/Customer';
import api from './api';

export const customerService = {
  register: async (data: RegisterRequest): Promise<Customer> => {
    const response = await api.post<Customer>('/api/customers/register', {
      username: data.username,
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  login: async (data: LoginRequest): Promise<Customer> => {
    const response = await api.post<Customer>('/api/customers/login', data);
    return response.data;
  },

  viewProfile: async (customerId: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/api/customers/${customerId}`);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<string> => {
    const response = await api.put<string>('/api/customers/change-password', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<string> => {
    const response = await api.put<string>('/api/customers/forgot-password', data);
    return response.data;
  },
};


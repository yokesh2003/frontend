import { Library } from '../types/Library';
import api from './api';

export const libraryService = {
  viewLibrary: async (customerId: number): Promise<Library[]> => {
    const response = await api.get<Library[]>(`/api/library/${customerId}`);
    return response.data;
  },

  removeFromLibrary: async (customerId: number, audioId: number): Promise<void> => {
    await api.delete(`/api/library/${customerId}/${audioId}`);
  },
};


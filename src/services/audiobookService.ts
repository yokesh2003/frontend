import { Audiobook } from '../types/Audiobook';
import { Author } from '../types/Author';
import api from './api';

export const audiobookService = {
  getAllAudiobooks: async (): Promise<Audiobook[]> => {
    const response = await api.get<Audiobook[]>('/api/audiobooks');
    return response.data;
  },

  getAudiobookById: async (audioId: number): Promise<Audiobook> => {
    const response = await api.get<Audiobook>(`/api/audiobooks/${audioId}`);
    return response.data;
  },

  searchAudiobooks: async (title: string, author: string): Promise<Audiobook[]> => {
    const response = await api.get<Audiobook[]>(`/api/audiobooks/search?title=${title}`);
    return response.data;
  },

  getAudiobooksByCategory: async (pageNo: number, pageSize: number, sortBy: string): Promise<Audiobook[]> => {
    // Not implemented in backend yet, returning empty list or all audiobooks
    const response = await api.get<Audiobook[]>('/api/audiobooks');
    return response.data;
  },

  getAudiobooksByAuthorId: async (authorId: number): Promise<Audiobook[]> => {
    const response = await api.get<Audiobook[]>(`/api/audiobooks/author/${authorId}`);
    return response.data;
  },

  getAllAuthors: async (): Promise<Author[]> => {
    const response = await api.get<Author[]>('/api/authors');
    return response.data;
  },
};


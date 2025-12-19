import api from './api';
import type { Brand, CreateBrandDto, UpdateBrandDto } from '../types';

export const brandService = {
  getAll: async (): Promise<Brand[]> => {
    const response = await api.get<Brand[]>('/brands');
    return response.data;
  },

  getById: async (id: string): Promise<Brand> => {
    const response = await api.get<Brand>(`/brands/${id}`);
    return response.data;
  },

  getByProductId: async (productId: string): Promise<Brand[]> => {
    const response = await api.get<Brand[]>(`/brands/product/${productId}`);
    return response.data;
  },

  create: async (data: CreateBrandDto): Promise<Brand> => {
    const response = await api.post<Brand>('/brands', data);
    return response.data;
  },

  update: async (id: string, data: UpdateBrandDto): Promise<Brand> => {
    const response = await api.put<Brand>(`/brands/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/brands/${id}`);
  },
};


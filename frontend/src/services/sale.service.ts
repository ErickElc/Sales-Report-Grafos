import api from './api';
import type { Sale, CreateSaleDto, UpdateSaleDto } from '../types';

export const saleService = {
  getAll: async (): Promise<Sale[]> => {
    const response = await api.get<Sale[]>('/sales');
    return response.data;
  },

  getByBrandId: async (brandId: string, months?: number[], year?: number): Promise<Sale[]> => {
    const params = new URLSearchParams();
    if (months && months.length > 0) {
      params.append('months', months.join(','));
    }
    if (year) {
      params.append('year', year.toString());
    }
    const queryString = params.toString();
    const url = `/sales/brand/${brandId}${queryString ? `?${queryString}` : ''}`;
    const response = await api.get<Sale[]>(url);
    return response.data;
  },

  getById: async (id: string): Promise<Sale> => {
    const response = await api.get<Sale>(`/sales/${id}`);
    return response.data;
  },

  create: async (data: CreateSaleDto): Promise<Sale> => {
    const response = await api.post<Sale>('/sales', data);
    return response.data;
  },

  update: async (id: string, data: UpdateSaleDto): Promise<Sale> => {
    const response = await api.put<Sale>(`/sales/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/sales/${id}`);
  },
};


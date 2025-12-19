import { ISale } from '../models/sale.model';
import { ISaleRepository } from '../repositories/sale.repository';

export interface ISaleService {
  getAllSales(): Promise<ISale[]>;
  getSalesByBrandId(brandId: string, year?: number): Promise<ISale[]>;
  getSalesByBrandIdAndMonths(brandId: string, months: number[], year?: number): Promise<ISale[]>;
  getSaleById(id: string): Promise<ISale | null>;
  createSale(data: { brandId: string; month: number; value: number; year: number }): Promise<ISale>;
  updateSale(id: string, data: { month: number; value: number; year: number }): Promise<ISale | null>;
  deleteSale(id: string): Promise<boolean>;
}

export class SaleService implements ISaleService {
  constructor(private readonly saleRepository: ISaleRepository) {}

  async getAllSales(): Promise<ISale[]> {
    return await this.saleRepository.findAll();
  }

  async getSalesByBrandId(brandId: string, year?: number): Promise<ISale[]> {
    return await this.saleRepository.findByBrandId(brandId, year);
  }

  async getSalesByBrandIdAndMonths(brandId: string, months: number[], year?: number): Promise<ISale[]> {
    return await this.saleRepository.findByBrandIdAndMonths(brandId, months, year);
  }

  async getSaleById(id: string): Promise<ISale | null> {
    return await this.saleRepository.findById(id);
  }

  async createSale(data: { brandId: string; month: number; value: number; year: number }): Promise<ISale> {
    return await this.saleRepository.create(data);
  }

  async updateSale(id: string, data: { month: number; value: number; year: number }): Promise<ISale | null> {
    return await this.saleRepository.update(id, data);
  }

  async deleteSale(id: string): Promise<boolean> {
    return await this.saleRepository.delete(id);
  }
}


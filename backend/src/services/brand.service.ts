import { IBrand } from '../models/brand.model';
import { IBrandRepository } from '../repositories/brand.repository';

export interface IBrandService {
  getAllBrands(): Promise<IBrand[]>;
  getBrandsByProductId(productId: string): Promise<IBrand[]>;
  getBrandById(id: string): Promise<IBrand | null>;
  createBrand(data: { name: string; productId: string }): Promise<IBrand>;
  updateBrand(id: string, data: { name: string; productId: string }): Promise<IBrand | null>;
  deleteBrand(id: string): Promise<boolean>;
}

export class BrandService implements IBrandService {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async getAllBrands(): Promise<IBrand[]> {
    return await this.brandRepository.findAll();
  }

  async getBrandsByProductId(productId: string): Promise<IBrand[]> {
    return await this.brandRepository.findByProductId(productId);
  }

  async getBrandById(id: string): Promise<IBrand | null> {
    return await this.brandRepository.findById(id);
  }

  async createBrand(data: { name: string; productId: string }): Promise<IBrand> {
    return await this.brandRepository.create(data);
  }

  async updateBrand(id: string, data: { name: string; productId: string }): Promise<IBrand | null> {
    return await this.brandRepository.update(id, data);
  }

  async deleteBrand(id: string): Promise<boolean> {
    return await this.brandRepository.delete(id);
  }
}


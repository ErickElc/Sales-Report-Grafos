import { IProduct } from '../models/product.model';
import { IProductRepository } from '../repositories/product.repository';

export interface IProductService {
  getAllProducts(): Promise<IProduct[]>;
  getProductsByCategoryId(categoryId: string): Promise<IProduct[]>;
  getProductById(id: string): Promise<IProduct | null>;
  createProduct(data: { name: string; categoryId: string }): Promise<IProduct>;
  updateProduct(id: string, data: { name: string; categoryId: string }): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<boolean>;
}

export class ProductService implements IProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async getAllProducts(): Promise<IProduct[]> {
    return await this.productRepository.findAll();
  }

  async getProductsByCategoryId(categoryId: string): Promise<IProduct[]> {
    return await this.productRepository.findByCategoryId(categoryId);
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return await this.productRepository.findById(id);
  }

  async createProduct(data: { name: string; categoryId: string }): Promise<IProduct> {
    return await this.productRepository.create(data);
  }

  async updateProduct(id: string, data: { name: string; categoryId: string }): Promise<IProduct | null> {
    return await this.productRepository.update(id, data);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return await this.productRepository.delete(id);
  }
}


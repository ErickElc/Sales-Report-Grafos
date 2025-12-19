import { ICategory } from '../models/category.model';
import { ICategoryRepository } from '../repositories/category.repository';

export interface ICategoryService {
  getAllCategories(): Promise<ICategory[]>;
  getCategoryById(id: string): Promise<ICategory | null>;
  createCategory(data: { name: string }): Promise<ICategory>;
  updateCategory(id: string, data: { name: string }): Promise<ICategory | null>;
  deleteCategory(id: string): Promise<boolean>;
}

export class CategoryService implements ICategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async getAllCategories(): Promise<ICategory[]> {
    return await this.categoryRepository.findAll();
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    return await this.categoryRepository.findById(id);
  }

  async createCategory(data: { name: string }): Promise<ICategory> {
    return await this.categoryRepository.create(data);
  }

  async updateCategory(id: string, data: { name: string }): Promise<ICategory | null> {
    return await this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: string): Promise<boolean> {
    return await this.categoryRepository.delete(id);
  }
}


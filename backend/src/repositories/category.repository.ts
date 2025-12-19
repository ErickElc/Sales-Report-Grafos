import { ICategory, Category } from '../models/category.model';

export interface ICategoryRepository {
  findAll(): Promise<ICategory[]>;
  findById(id: string): Promise<ICategory | null>;
  create(data: { name: string }): Promise<ICategory>;
  update(id: string, data: { name: string }): Promise<ICategory | null>;
  delete(id: string): Promise<boolean>;
}

export class CategoryRepository implements ICategoryRepository {
  async findAll(): Promise<ICategory[]> {
    return await Category.find().sort({ name: 1 });
  }

  async findById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  async create(data: { name: string }): Promise<ICategory> {
    return await Category.create(data);
  }

  async update(id: string, data: { name: string }): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Category.findByIdAndDelete(id);
    return !!result;
  }
}


import { IProduct, Product } from '../models/product.model';

export interface IProductRepository {
  findAll(): Promise<IProduct[]>;
  findByCategoryId(categoryId: string): Promise<IProduct[]>;
  findById(id: string): Promise<IProduct | null>;
  create(data: { name: string; categoryId: string }): Promise<IProduct>;
  update(id: string, data: { name: string; categoryId: string }): Promise<IProduct | null>;
  delete(id: string): Promise<boolean>;
}

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<IProduct[]> {
    return await Product.find().populate('categoryId').sort({ name: 1 });
  }

  async findByCategoryId(categoryId: string): Promise<IProduct[]> {
    return await Product.find({ categoryId }).sort({ name: 1 });
  }

  async findById(id: string): Promise<IProduct | null> {
    return await Product.findById(id).populate('categoryId');
  }

  async create(data: { name: string; categoryId: string }): Promise<IProduct> {
    return await Product.create(data);
  }

  async update(id: string, data: { name: string; categoryId: string }): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, data, { new: true }).populate('categoryId');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }
}


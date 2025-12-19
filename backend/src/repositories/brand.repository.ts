import { IBrand, Brand } from '../models/brand.model';

export interface IBrandRepository {
  findAll(): Promise<IBrand[]>;
  findByProductId(productId: string): Promise<IBrand[]>;
  findById(id: string): Promise<IBrand | null>;
  create(data: { name: string; productId: string }): Promise<IBrand>;
  update(id: string, data: { name: string; productId: string }): Promise<IBrand | null>;
  delete(id: string): Promise<boolean>;
}

export class BrandRepository implements IBrandRepository {
  async findAll(): Promise<IBrand[]> {
    return await Brand.find().populate('productId').sort({ name: 1 });
  }

  async findByProductId(productId: string): Promise<IBrand[]> {
    return await Brand.find({ productId }).sort({ name: 1 });
  }

  async findById(id: string): Promise<IBrand | null> {
    return await Brand.findById(id).populate('productId');
  }

  async create(data: { name: string; productId: string }): Promise<IBrand> {
    return await Brand.create(data);
  }

  async update(id: string, data: { name: string; productId: string }): Promise<IBrand | null> {
    return await Brand.findByIdAndUpdate(id, data, { new: true }).populate('productId');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Brand.findByIdAndDelete(id);
    return !!result;
  }
}


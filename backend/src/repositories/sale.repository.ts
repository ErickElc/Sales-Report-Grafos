import { ISale, Sale } from '../models/sale.model';

export interface ISaleRepository {
  findByBrandId(brandId: string, year?: number): Promise<ISale[]>;
  findByBrandIdAndMonths(brandId: string, months: number[], year?: number): Promise<ISale[]>;
  findById(id: string): Promise<ISale | null>;
  create(data: { brandId: string; month: number; value: number; year: number }): Promise<ISale>;
  update(id: string, data: { month: number; value: number; year: number }): Promise<ISale | null>;
  delete(id: string): Promise<boolean>;
}

export class SaleRepository implements ISaleRepository {
  async findAll(): Promise<ISale[]> {
    return await Sale.find().populate('brandId').sort({ year: -1, month: 1 });
  }

  async findByBrandId(brandId: string, year?: number): Promise<ISale[]> {
    const query: any = { brandId };
    if (year) {
      query.year = year;
    }
    return await Sale.find(query).populate('brandId').sort({ month: 1 });
  }

  async findByBrandIdAndMonths(brandId: string, months: number[], year?: number): Promise<ISale[]> {
    const query: any = { brandId, month: { $in: months } };
    if (year) {
      query.year = year;
    }
    return await Sale.find(query).populate('brandId').sort({ month: 1 });
  }

  async findById(id: string): Promise<ISale | null> {
    return await Sale.findById(id).populate('brandId');
  }

  async create(data: { brandId: string; month: number; value: number; year: number }): Promise<ISale> {
    return await Sale.create(data);
  }

  async update(id: string, data: { month: number; value: number; year: number }): Promise<ISale | null> {
    return await Sale.findByIdAndUpdate(id, data, { new: true }).populate('brandId');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Sale.findByIdAndDelete(id);
    return !!result;
  }
}


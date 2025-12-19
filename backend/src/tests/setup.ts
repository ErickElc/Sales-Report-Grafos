import mongoose from 'mongoose';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import { Sale } from '../models/sale.model';

afterEach(async () => {
  // Clean up collections after each test
  if (mongoose.connection.readyState === 1) {
    try {
      await Category.deleteMany({});
      await Product.deleteMany({});
      await Brand.deleteMany({});
      await Sale.deleteMany({});
    } catch (error) {
      // Ignore errors during cleanup
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
});


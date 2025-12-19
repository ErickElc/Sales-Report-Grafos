import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import { Sale } from '../models/sale.model';
import { connectDatabase } from './connection';

dotenv.config();

const seedData = async () => {
  try {
    await connectDatabase();

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Brand.deleteMany({});
    await Sale.deleteMany({});

    console.log('🗑️  Old data removed');

    // Create categories (3 categorias é suficiente)
    const categoryFood = await Category.create({ name: 'Comida' });
    const categoryDrink = await Category.create({ name: 'Bebida' });
    const categoryElectronics = await Category.create({ name: 'Eletrônicos' });

    console.log('✅ Categories created');

    // Create products (mais produtos para teste de volume)
    const products = await Product.insertMany([
      // Food
      { name: 'Frutas', categoryId: categoryFood._id },
      { name: 'Vegetais', categoryId: categoryFood._id },
      { name: 'Carnes', categoryId: categoryFood._id },
      { name: 'Laticínios', categoryId: categoryFood._id },
      { name: 'Grãos', categoryId: categoryFood._id },
      { name: 'Doces', categoryId: categoryFood._id },
      // Drink
      { name: 'Refrigerante', categoryId: categoryDrink._id },
      { name: 'Suco', categoryId: categoryDrink._id },
      { name: 'Água', categoryId: categoryDrink._id },
      { name: 'Café', categoryId: categoryDrink._id },
      { name: 'Chá', categoryId: categoryDrink._id },
      // Electronics
      { name: 'Smartphone', categoryId: categoryElectronics._id },
      { name: 'Notebook', categoryId: categoryElectronics._id },
      { name: 'Tablet', categoryId: categoryElectronics._id },
      { name: 'Smart TV', categoryId: categoryElectronics._id },
      { name: 'Fone de Ouvido', categoryId: categoryElectronics._id },
    ]);

    console.log('✅ Products created:', products.length);

    // Create brands (mais marcas por produto)
    const brands: Array<{ name: string; productId: any }> = [];
    products.forEach((product, idx) => {
      // Cada produto terá de 3 a 5 marcas
      const brandCount = 3 + (idx % 3); // 3, 4, ou 5 marcas
      for (let i = 1; i <= brandCount; i++) {
        brands.push({
          name: `${product.name} Marca ${i}`,
          productId: product._id,
        });
      }
    });

    const createdBrands = await Brand.insertMany(brands);
    console.log('✅ Brands created:', createdBrands.length);

    // Create sales for the first 4 months
    const year = new Date().getFullYear();
    const months = [1, 2, 3, 4];

    const salesData: Array<{ brandId: any; month: number; value: number; year: number }> = [];
    createdBrands.forEach((brand) => {
      months.forEach((month) => {
        // Random sales value between 50 and 1000
        const value = Math.floor(Math.random() * 950) + 50;
        salesData.push({
          brandId: brand._id,
          month,
          value,
          year,
        });
      });
    });

    await Sale.insertMany(salesData);
    console.log('✅ Sales created:', salesData.length);
    console.log('🎉 Seed completed successfully!');
    console.log(`   - Categories: 3`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Brands: ${createdBrands.length}`);
    console.log(`   - Sales: ${salesData.length}`);

    // Close connection but don't exit if running in Docker
    await mongoose.connection.close();

    // Only exit if not in Docker container
    if (!process.env.DOCKER_CONTAINER) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error executing seed:', error);
    if (!process.env.DOCKER_CONTAINER) {
      process.exit(1);
    }
    throw error;
  }
};

// Only run if called directly (not when imported)
if (require.main === module) {
  seedData();
}

export default seedData;

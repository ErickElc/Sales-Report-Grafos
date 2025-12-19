import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { Brand } from '../../models/brand.model';
import { Sale } from '../../models/sale.model';

export const createTestData = async () => {
  // Clean existing data first to avoid duplicate key errors
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Brand.deleteMany({});
  await Sale.deleteMany({});

  // Create categories
  const categoryFood = await Category.create({ name: 'Food' });
  const categoryDrink = await Category.create({ name: 'Drink' });
  const categoryElectronics = await Category.create({ name: 'Electronics' });

  // Create products
  const productFruit = await Product.create({ name: 'Fruit', categoryId: categoryFood._id });
  const productSoda = await Product.create({ name: 'Soda', categoryId: categoryDrink._id });
  const productSmartphone = await Product.create({ name: 'Smartphone', categoryId: categoryElectronics._id });

  // Create brands
  const brandFruits1 = await Brand.create({ name: 'Fruits1', productId: productFruit._id });
  const brandFruits2 = await Brand.create({ name: 'Fruits2', productId: productFruit._id });
  const brandCocaCola = await Brand.create({ name: 'Coca-Cola', productId: productSoda._id });
  const brandApple = await Brand.create({ name: 'Apple', productId: productSmartphone._id });

  // Create sales
  const year = new Date().getFullYear();
  await Sale.insertMany([
    { brandId: brandFruits1._id, month: 1, value: 120, year },
    { brandId: brandFruits1._id, month: 2, value: 140, year },
    { brandId: brandFruits1._id, month: 3, value: 110, year },
    { brandId: brandFruits1._id, month: 4, value: 95, year },
    { brandId: brandFruits2._id, month: 1, value: 103, year },
    { brandId: brandFruits2._id, month: 2, value: 150, year },
    { brandId: brandFruits2._id, month: 3, value: 60, year },
    { brandId: brandFruits2._id, month: 4, value: 30, year },
  ]);

  return {
    categories: { categoryFood, categoryDrink, categoryElectronics },
    products: { productFruit, productSoda, productSmartphone },
    brands: { brandFruits1, brandFruits2, brandCocaCola, brandApple },
  };
};


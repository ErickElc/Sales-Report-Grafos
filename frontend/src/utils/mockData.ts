import type { Category, Product, Brand, Sale } from '../types';

export const mockCategories: Category[] = [
  {
    _id: 'mock-cat-1',
    name: 'Comida',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-cat-2',
    name: 'Bebida',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-cat-3',
    name: 'Eletrônicos',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockProducts: Product[] = [
  {
    _id: 'mock-prod-1',
    name: 'Fruta',
    categoryId: 'mock-cat-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-prod-2',
    name: 'Refrigerante',
    categoryId: 'mock-cat-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-prod-3',
    name: 'Smartphone',
    categoryId: 'mock-cat-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockBrands: Brand[] = [
  {
    _id: 'mock-brand-1',
    name: 'Frutas1',
    productId: 'mock-prod-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-brand-2',
    name: 'Frutas2',
    productId: 'mock-prod-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-brand-3',
    name: 'Coca-Cola',
    productId: 'mock-prod-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-brand-4',
    name: 'Apple',
    productId: 'mock-prod-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockSales: Sale[] = [
  {
    _id: 'mock-sale-1',
    brandId: 'mock-brand-1',
    month: 1,
    value: 103,
    year: new Date().getFullYear(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-sale-2',
    brandId: 'mock-brand-1',
    month: 2,
    value: 150,
    year: new Date().getFullYear(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-sale-3',
    brandId: 'mock-brand-1',
    month: 3,
    value: 60,
    year: new Date().getFullYear(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-sale-4',
    brandId: 'mock-brand-1',
    month: 4,
    value: 30,
    year: new Date().getFullYear(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-sale-5',
    brandId: 'mock-brand-2',
    month: 1,
    value: 120,
    year: new Date().getFullYear(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-sale-6',
    brandId: 'mock-brand-2',
    month: 2,
    value: 180,
    year: new Date().getFullYear(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-sale-7',
    brandId: 'mock-brand-2',
    month: 3,
    value: 90,
    year: new Date().getFullYear(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-sale-8',
    brandId: 'mock-brand-2',
    month: 4,
    value: 45,
    year: new Date().getFullYear(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getMockSalesByBrandId = (brandId: string): Sale[] => {
  return mockSales.filter(sale => {
    const saleBrandId = typeof sale.brandId === 'object' ? sale.brandId._id : sale.brandId;
    return saleBrandId === brandId;
  });
};

export const getMockProductsByCategoryId = (categoryId: string): Product[] => {
  return mockProducts.filter(product => {
    const productCategoryId = typeof product.categoryId === 'object' 
      ? product.categoryId._id 
      : product.categoryId;
    return productCategoryId === categoryId;
  });
};

export const getMockBrandsByProductId = (productId: string): Brand[] => {
  return mockBrands.filter(brand => {
    const brandProductId = typeof brand.productId === 'object' 
      ? brand.productId._id 
      : brand.productId;
    return brandProductId === productId;
  });
};


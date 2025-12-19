import request from 'supertest';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDatabase } from '../database/connection';
import { categoryRouter } from '../routes/category.routes';
import { productRouter } from '../routes/product.routes';
import { brandRouter } from '../routes/brand.routes';
import { saleRouter } from '../routes/sale.routes';
import { createTestData } from './helpers/test-data';

let app: express.Application;

beforeAll(async () => {
  process.env.MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/sales-report-test';
  
  try {
    await connectDatabase();
  } catch (error) {
    console.error('⚠️  MongoDB connection failed. Make sure MongoDB is running:');
    console.error('   docker-compose up -d mongodb');
    console.error('   or');
    console.error('   mongod');
    throw error;
  }

  app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/categories', categoryRouter);
  app.use('/api/products', productRouter);
  app.use('/api/brands', brandRouter);
  app.use('/api/sales', saleRouter);
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
  });
}, 30000); // 30 second timeout

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
});

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', message: 'API is running' });
  });
});

describe('Categories API', () => {
  it('should get all categories', async () => {
    await createTestData();
    const response = await request(app).get('/api/categories');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('_id');
  });

  it('should get category by id', async () => {
    await createTestData();
    const categories = await request(app).get('/api/categories');
    const categoryId = categories.body[0]._id;

    const response = await request(app).get(`/api/categories/${categoryId}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', categoryId);
    expect(response.body).toHaveProperty('name');
  });

  it('should return 404 for non-existent category', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const response = await request(app).get(`/api/categories/${fakeId}`);
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Category not found');
  });
});

describe('Products API', () => {
  it('should get all products', async () => {
    await createTestData();
    const response = await request(app).get('/api/products');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('categoryId');
  });

  it('should get products by category id', async () => {
    await createTestData();
    const categories = await request(app).get('/api/categories');
    const categoryId = categories.body[0]._id;

    const response = await request(app).get(`/api/products/category/${categoryId}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((product: any) => {
      const productCategoryId = product.categoryId?._id?.toString() || product.categoryId?.toString() || product.categoryId;
      expect(productCategoryId).toBe(categoryId);
    });
  });

  it('should get product by id', async () => {
    await createTestData();
    const products = await request(app).get('/api/products');
    const productId = products.body[0]._id;

    const response = await request(app).get(`/api/products/${productId}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', productId);
    expect(response.body).toHaveProperty('name');
  });

  it('should return 404 for non-existent product', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const response = await request(app).get(`/api/products/${fakeId}`);
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Product not found');
  });
});

describe('Brands API', () => {
  it('should get all brands', async () => {
    await createTestData();
    const response = await request(app).get('/api/brands');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('productId');
  });

  it('should get brands by product id', async () => {
    await createTestData();
    const products = await request(app).get('/api/products');
    const productId = products.body[0]._id;

    const response = await request(app).get(`/api/brands/product/${productId}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((brand: any) => {
      const brandProductId = brand.productId?._id?.toString() || brand.productId?.toString() || brand.productId;
      expect(brandProductId).toBe(productId);
    });
  });

  it('should get brand by id', async () => {
    await createTestData();
    const brands = await request(app).get('/api/brands');
    const brandId = brands.body[0]._id;

    const response = await request(app).get(`/api/brands/${brandId}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', brandId);
    expect(response.body).toHaveProperty('name');
  });

  it('should return 404 for non-existent brand', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const response = await request(app).get(`/api/brands/${fakeId}`);
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Brand not found');
  });
});

describe('Sales API', () => {
  it('should get sales by brand id with default months', async () => {
    const testData = await createTestData();
    const brandId = testData.brands.brandFruits1._id.toString();

    const response = await request(app).get(`/api/sales/brand/${brandId}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(4); // Default: first 4 months
    response.body.forEach((sale: any) => {
      const saleBrandId = sale.brandId?._id?.toString() || sale.brandId?.toString() || sale.brandId;
      expect(saleBrandId).toBe(brandId);
      expect(sale).toHaveProperty('month');
      expect(sale).toHaveProperty('value');
      expect(sale).toHaveProperty('year');
    });
  });

  it('should get sales by brand id with specific months', async () => {
    const testData = await createTestData();
    const brandId = testData.brands.brandFruits1._id.toString();

    const response = await request(app).get(`/api/sales/brand/${brandId}?months=1,2`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0].month).toBe(1);
    expect(response.body[1].month).toBe(2);
  });

  it('should get sales by brand id with specific year', async () => {
    const testData = await createTestData();
    const brandId = testData.brands.brandFruits1._id.toString();
    const currentYear = new Date().getFullYear();

    const response = await request(app).get(`/api/sales/brand/${brandId}?year=${currentYear}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((sale: any) => {
      expect(sale.year).toBe(currentYear);
    });
  });
});

describe('Dependent Selects Flow', () => {
  it('should return correct flow: category -> products -> brands -> sales', async () => {
    const testData = await createTestData();
    const categoryId = testData.categories.categoryFood._id.toString();
    const productId = testData.products.productFruit._id.toString();
    const brandId = testData.brands.brandFruits1._id.toString();

    // 1. Get categories
    const categoriesResponse = await request(app).get('/api/categories');
    expect(categoriesResponse.status).toBe(200);
    expect(categoriesResponse.body.length).toBeGreaterThan(0);

    // 2. Get products by category
    const productsResponse = await request(app).get(`/api/products/category/${categoryId}`);
    expect(productsResponse.status).toBe(200);
    expect(productsResponse.body.length).toBeGreaterThan(0);

    // 3. Get brands by product
    const brandsResponse = await request(app).get(`/api/brands/product/${productId}`);
    expect(brandsResponse.status).toBe(200);
    expect(brandsResponse.body.length).toBeGreaterThan(0);

    // 4. Get sales by brand
    const salesResponse = await request(app).get(`/api/sales/brand/${brandId}`);
    expect(salesResponse.status).toBe(200);
    expect(salesResponse.body.length).toBe(4);
  });
});


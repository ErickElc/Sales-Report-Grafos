import swaggerJsdoc from 'swagger-jsdoc';
import type { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Sales Report API',
    version: '1.0.0',
    description: 'REST API for managing sales reports with categories, products, brands, and sales data',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Categories', description: 'Category management endpoints' },
    { name: 'Products', description: 'Product management endpoints' },
    { name: 'Brands', description: 'Brand management endpoints' },
    { name: 'Sales', description: 'Sales data endpoints' },
    { name: 'Health', description: 'Health check endpoint' },
  ],
  components: {
    schemas: {
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          name: { type: 'string', example: 'Food' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
          name: { type: 'string', example: 'Fruit' },
          categoryId: { type: 'string', example: '507f1f77bcf86cd799439011' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Brand: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
          name: { type: 'string', example: 'Fruits1' },
          productId: { type: 'string', example: '507f1f77bcf86cd799439012' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Sale: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439014' },
          brandId: { type: 'string', example: '507f1f77bcf86cd799439013' },
          month: { type: 'number', example: 1, minimum: 1, maximum: 12 },
          value: { type: 'number', example: 100.50 },
          year: { type: 'number', example: 2024 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateCategoryDto: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Food' },
        },
      },
      CreateProductDto: {
        type: 'object',
        required: ['name', 'categoryId'],
        properties: {
          name: { type: 'string', example: 'Fruit' },
          categoryId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        },
      },
      CreateBrandDto: {
        type: 'object',
        required: ['name', 'productId'],
        properties: {
          name: { type: 'string', example: 'Fruits1' },
          productId: { type: 'string', example: '507f1f77bcf86cd799439012' },
        },
      },
      CreateSaleDto: {
        type: 'object',
        required: ['brandId', 'month', 'value', 'year'],
        properties: {
          brandId: { type: 'string', example: '507f1f77bcf86cd799439013' },
          month: { type: 'number', example: 1, minimum: 1, maximum: 12 },
          value: { type: 'number', example: 100.50 },
          year: { type: 'number', example: 2024 },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Error message' },
          error: { type: 'string', example: 'Error details' },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/server.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);


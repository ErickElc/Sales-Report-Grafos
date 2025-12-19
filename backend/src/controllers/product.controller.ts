import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { ProductRepository } from '../repositories/product.repository';

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

export class ProductController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products' });
    }
  }

  static async getByCategoryId(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      
      // Validar se o categoryId é um ObjectId válido do MongoDB
      if (categoryId && categoryId.startsWith('mock-')) {
        res.status(400).json({ 
          error: 'Invalid category ID. Mock IDs are not supported in backend requests.' 
        });
        return;
      }
      
      const products = await productService.getProductsByCategoryId(categoryId);
      res.json(products);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error fetching products by category';
      res.status(500).json({ error: errorMessage });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching product' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, categoryId } = req.body;
      if (!name || !categoryId) {
        res.status(400).json({ error: 'Name and categoryId are required' });
        return;
      }
      const product = await productService.createProduct({ name, categoryId });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error creating product' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, categoryId } = req.body;
      if (!name || !categoryId) {
        res.status(400).json({ error: 'Name and categoryId are required' });
        return;
      }
      const product = await productService.updateProduct(id, { name, categoryId });
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error updating product' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await productService.deleteProduct(id);
      if (!deleted) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product' });
    }
  }
}


import { Request, Response } from 'express';
import { BrandService } from '../services/brand.service';
import { BrandRepository } from '../repositories/brand.repository';

const brandRepository = new BrandRepository();
const brandService = new BrandService(brandRepository);

export class BrandController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const brands = await brandService.getAllBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching brands' });
    }
  }

  static async getByProductId(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      
      // Validar se o productId é um ObjectId válido do MongoDB
      if (productId && productId.startsWith('mock-')) {
        res.status(400).json({ 
          error: 'Invalid product ID. Mock IDs are not supported in backend requests.' 
        });
        return;
      }
      
      const brands = await brandService.getBrandsByProductId(productId);
      res.json(brands);
    } catch (error) {
      console.error('Error fetching brands by product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error fetching brands by product';
      res.status(500).json({ error: errorMessage });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const brand = await brandService.getBrandById(id);
      
      if (!brand) {
        res.status(404).json({ error: 'Brand not found' });
        return;
      }
      
      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching brand' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, productId } = req.body;
      if (!name || !productId) {
        res.status(400).json({ error: 'Name and productId are required' });
        return;
      }
      const brand = await brandService.createBrand({ name, productId });
      res.status(201).json(brand);
    } catch (error) {
      res.status(500).json({ error: 'Error creating brand' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, productId } = req.body;
      if (!name || !productId) {
        res.status(400).json({ error: 'Name and productId are required' });
        return;
      }
      const brand = await brandService.updateBrand(id, { name, productId });
      if (!brand) {
        res.status(404).json({ error: 'Brand not found' });
        return;
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: 'Error updating brand' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await brandService.deleteBrand(id);
      if (!deleted) {
        res.status(404).json({ error: 'Brand not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting brand' });
    }
  }
}


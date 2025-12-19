import { Request, Response } from 'express';
import { SaleService } from '../services/sale.service';
import { SaleRepository } from '../repositories/sale.repository';

const saleRepository = new SaleRepository();
const saleService = new SaleService(saleRepository);

export class SaleController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const sales = await saleService.getAllSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching sales' });
    }
  }

  static async getByBrandId(req: Request, res: Response): Promise<void> {
    try {
      const { brandId } = req.params;
      
      // Validar se o brandId é um ObjectId válido do MongoDB
      if (brandId && brandId.startsWith('mock-')) {
        res.status(400).json({ 
          error: 'Invalid brand ID. Mock IDs are not supported in backend requests.' 
        });
        return;
      }
      
      const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
      const months = req.query.months ? (req.query.months as string).split(',').map(Number) : [1, 2, 3, 4];
      
      const sales = await saleService.getSalesByBrandIdAndMonths(brandId, months, year);
      res.json(sales);
    } catch (error) {
      console.error('Error fetching sales by brand:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error fetching sales by brand';
      res.status(500).json({ error: errorMessage });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const sale = await saleService.getSaleById(id);
      
      if (!sale) {
        res.status(404).json({ error: 'Sale not found' });
        return;
      }
      
      res.json(sale);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching sale' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { brandId, month, value, year } = req.body;
      if (!brandId || !month || value === undefined || !year) {
        res.status(400).json({ error: 'brandId, month, value, and year are required' });
        return;
      }
      const sale = await saleService.createSale({ brandId, month, value, year });
      res.status(201).json(sale);
    } catch (error) {
      res.status(500).json({ error: 'Error creating sale' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { month, value, year } = req.body;
      if (month === undefined || value === undefined || !year) {
        res.status(400).json({ error: 'month, value, and year are required' });
        return;
      }
      const sale = await saleService.updateSale(id, { month, value, year });
      if (!sale) {
        res.status(404).json({ error: 'Sale not found' });
        return;
      }
      res.json(sale);
    } catch (error) {
      res.status(500).json({ error: 'Error updating sale' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await saleService.deleteSale(id);
      if (!deleted) {
        res.status(404).json({ error: 'Sale not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting sale' });
    }
  }
}


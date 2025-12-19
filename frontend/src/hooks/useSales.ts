import { useEffect } from 'react';
import { useAppState } from './useAppState';
import { saleService } from '../services/sale.service';
import type { Sale, CreateSaleDto, UpdateSaleDto } from '../types';

/**
 * Hook for managing sales - simple fetch from backend
 */
export const useSales = () => {
  const { state, dispatch } = useAppState();

  const loadSales = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const sales = await saleService.getAll();
      dispatch({ type: 'SET_SALES', payload: sales });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load sales';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error loading sales:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createSale = async (data: CreateSaleDto): Promise<Sale> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const sale = await saleService.create(data);
      dispatch({ type: 'ADD_SALE', payload: sale });
      await loadSales(); // Reload all sales
      return sale;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create sale';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateSale = async (id: string, data: UpdateSaleDto): Promise<Sale> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const sale = await saleService.update(id, data);
      dispatch({ type: 'UPDATE_SALE', payload: sale });
      await loadSales(); // Reload all sales
      return sale;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update sale';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteSale = async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await saleService.delete(id);
      dispatch({ type: 'DELETE_SALE', payload: id });
      await loadSales(); // Reload all sales
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete sale';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load all sales once on mount
  useEffect(() => {
    loadSales();
  }, []);

  return {
    sales: state.sales,
    loading: state.loading,
    error: state.error,
    loadSales,
    createSale,
    updateSale,
    deleteSale,
  };
};

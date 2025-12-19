import { useAppState } from './useAppState';
import { productService } from '../services/product.service';
import type { Product, CreateProductDto, UpdateProductDto } from '../types';

/**
 * Hook for managing products - simple fetch from backend
 */
export const useProducts = () => {
  const { state, dispatch } = useAppState();

  const loadProducts = async (categoryId?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const products = categoryId
        ? await productService.getByCategoryId(categoryId)
        : await productService.getAll();
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load products';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error loading products:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createProduct = async (data: CreateProductDto): Promise<Product> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const product = await productService.create(data);
      dispatch({ type: 'ADD_PRODUCT', payload: product });
      return product;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateProduct = async (id: string, data: UpdateProductDto): Promise<Product> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const product = await productService.update(id, data);
      dispatch({ type: 'UPDATE_PRODUCT', payload: product });
      return product;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await productService.delete(id);
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return {
    products: state.products,
    loading: state.loading,
    error: state.error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

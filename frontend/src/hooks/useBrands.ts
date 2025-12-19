import { useAppState } from './useAppState';
import { brandService } from '../services/brand.service';
import type { Brand, CreateBrandDto, UpdateBrandDto } from '../types';

/**
 * Hook for managing brands - simple fetch from backend
 */
export const useBrands = () => {
  const { state, dispatch } = useAppState();

  const loadBrands = async (productId?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const brands = productId
        ? await brandService.getByProductId(productId)
        : await brandService.getAll();
      dispatch({ type: 'SET_BRANDS', payload: brands });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load brands';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error loading brands:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createBrand = async (data: CreateBrandDto): Promise<Brand> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const brand = await brandService.create(data);
      dispatch({ type: 'ADD_BRAND', payload: brand });
      return brand;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create brand';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateBrand = async (id: string, data: UpdateBrandDto): Promise<Brand> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const brand = await brandService.update(id, data);
      dispatch({ type: 'UPDATE_BRAND', payload: brand });
      return brand;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update brand';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteBrand = async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await brandService.delete(id);
      dispatch({ type: 'DELETE_BRAND', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete brand';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return {
    brands: state.brands,
    loading: state.loading,
    error: state.error,
    loadBrands,
    createBrand,
    updateBrand,
    deleteBrand,
  };
};

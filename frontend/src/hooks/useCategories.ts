import { useEffect } from 'react';
import { useAppState } from './useAppState';
import { categoryService } from '../services/category.service';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types';

/**
 * Hook for managing categories - simple fetch from backend
 */
export const useCategories = () => {
  const { state, dispatch } = useAppState();

  const loadCategories = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const categories = await categoryService.getAll();
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load categories';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error loading categories:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createCategory = async (data: CreateCategoryDto): Promise<Category> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const category = await categoryService.create(data);
      dispatch({ type: 'ADD_CATEGORY', payload: category });
      return category;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create category';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateCategory = async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const category = await categoryService.update(id, data);
      dispatch({ type: 'UPDATE_CATEGORY', payload: category });
      return category;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update category';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await categoryService.delete(id);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load categories on mount
  useEffect(() => {
    if (state.categories.length === 0) {
      loadCategories();
    }
  }, []);

  return {
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

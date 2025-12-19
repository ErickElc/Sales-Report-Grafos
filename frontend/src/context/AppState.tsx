import React, { useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Category, Product, Brand, Sale } from '../types';
import { AppContext } from './AppContext';
import { categoryService } from '../services/category.service';
import { productService } from '../services/product.service';
import { brandService } from '../services/brand.service';
import { saleService } from '../services/sale.service';

interface AppState {
  categories: Category[];
  products: Product[];
  brands: Brand[];
  sales: Sale[];
  selectedCategory: Category | null;
  selectedProduct: Product | null;
  selectedBrand: Brand | null;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_BRANDS'; payload: Brand[] }
  | { type: 'SET_SALES'; payload: Sale[] }
  | { type: 'SET_SELECTED_CATEGORY'; payload: Category | null }
  | { type: 'SET_SELECTED_PRODUCT'; payload: Product | null }
  | { type: 'SET_SELECTED_BRAND'; payload: Brand | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_BRAND'; payload: Brand }
  | { type: 'UPDATE_BRAND'; payload: Brand }
  | { type: 'DELETE_BRAND'; payload: string }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'UPDATE_SALE'; payload: Sale }
  | { type: 'DELETE_SALE'; payload: string };

const initialState: AppState = {
  categories: [],
  products: [],
  brands: [],
  sales: [],
  selectedCategory: null,
  selectedProduct: null,
  selectedBrand: null,
  loading: false,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };

    case 'SET_BRANDS':
      return { ...state, brands: action.payload };

    case 'SET_SALES':
      return { ...state, sales: action.payload };

    case 'SET_SELECTED_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        selectedProduct: null,
        selectedBrand: null,
      };

    case 'SET_SELECTED_PRODUCT':
      return {
        ...state,
        selectedProduct: action.payload,
        selectedBrand: null,
      };

    case 'SET_SELECTED_BRAND':
      return {
        ...state,
        selectedBrand: action.payload,
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat._id === action.payload._id ? action.payload : cat
        ),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((cat) => cat._id !== action.payload),
      };

    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((product) => product._id !== action.payload),
      };

    case 'ADD_BRAND':
      return { ...state, brands: [...state.brands, action.payload] };

    case 'UPDATE_BRAND':
      return {
        ...state,
        brands: state.brands.map((brand) =>
          brand._id === action.payload._id ? action.payload : brand
        ),
      };

    case 'DELETE_BRAND':
      return {
        ...state,
        brands: state.brands.filter((brand) => brand._id !== action.payload),
      };

    case 'ADD_SALE':
      return { ...state, sales: [...state.sales, action.payload] };

    case 'UPDATE_SALE':
      return {
        ...state,
        sales: state.sales.map((sale) =>
          sale._id === action.payload._id ? action.payload : sale
        ),
      };

    case 'DELETE_SALE':
      return {
        ...state,
        sales: state.sales.filter((sale) => sale._id !== action.payload),
      };

    default:
      return state;
  }
};

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const smartLoad = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const [categoryCount, productCount, brandCount] = await Promise.all([
          fetch('http://localhost:3000/api/categories').then(r => r.json()).then(data => data.length),
          fetch('http://localhost:3000/api/products').then(r => r.json()).then(data => data.length),
          fetch('http://localhost:3000/api/brands').then(r => r.json()).then(data => data.length),
        ]);

        const totalItems = categoryCount + productCount + brandCount;

        if (totalItems <= 100) {
          const [categories, products, brands, sales] = await Promise.all([
            categoryService.getAll(),
            productService.getAll(),
            brandService.getAll(),
            saleService.getAll(),
          ]);

          dispatch({ type: 'SET_CATEGORIES', payload: categories });
          dispatch({ type: 'SET_PRODUCTS', payload: products });
          dispatch({ type: 'SET_BRANDS', payload: brands });
          dispatch({ type: 'SET_SALES', payload: sales });
          dispatch({ type: 'SET_LOADING', payload: false });
        } else {
          const [categories, sales] = await Promise.all([
            categoryService.getAll(),
            saleService.getAll(),
          ]);

          dispatch({ type: 'SET_CATEGORIES', payload: categories });
          dispatch({ type: 'SET_SALES', payload: sales });
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    smartLoad();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider = AppStateProvider;
export type AppContextType = { state: AppState; dispatch: React.Dispatch<AppAction> };
export type { AppState, AppAction };

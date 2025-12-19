import React, { useMemo } from 'react';
import { useAppState } from '../../hooks/useAppState';

/**
 * Product selection dropdown - filters products from state by selected category
 */
export const ProductSelect: React.FC = () => {
  const { state, dispatch } = useAppState();

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (!state.selectedCategory) return [];

    const categoryId = typeof state.selectedCategory === 'object'
      ? state.selectedCategory._id
      : state.selectedCategory;

    return state.products.filter(product => {
      const prodCategoryId = typeof product.categoryId === 'object'
        ? product.categoryId._id
        : product.categoryId;
      return prodCategoryId === categoryId;
    });
  }, [state.selectedCategory, state.products]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const product = filteredProducts.find(prod => prod._id === productId) || null;
    dispatch({ type: 'SET_SELECTED_PRODUCT', payload: product });
  };

  if (!state.selectedCategory) {
    return null;
  }

  return (
    <div className="select-container">
      <label htmlFor="product-select">Produto:</label>
      <select
        id="product-select"
        value={state.selectedProduct?._id || ''}
        onChange={handleChange}
        disabled={state.loading}
        className="select-input"
      >
        <option value="">Selecione um produto</option>
        {filteredProducts.map(product => (
          <option key={product._id} value={product._id}>
            {product.name}
          </option>
        ))}
      </select>
    </div>
  );
};

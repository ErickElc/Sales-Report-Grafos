import React, { useMemo } from 'react';
import { useAppState } from '../../hooks/useAppState';

/**
 * Brand selection dropdown - filters brands from state by selected product
 */
export const BrandSelect: React.FC = () => {
  const { state, dispatch } = useAppState();

  // Filter brands by selected product
  const filteredBrands = useMemo(() => {
    if (!state.selectedProduct) return [];

    const productId = typeof state.selectedProduct === 'object'
      ? state.selectedProduct._id
      : state.selectedProduct;

    return state.brands.filter(brand => {
      const brandProductId = typeof brand.productId === 'object'
        ? brand.productId._id
        : brand.productId;
      return brandProductId === productId;
    });
  }, [state.selectedProduct, state.brands]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value;
    const brand = filteredBrands.find(b => b._id === brandId) || null;
    dispatch({ type: 'SET_SELECTED_BRAND', payload: brand });
  };

  if (!state.selectedProduct) {
    return null;
  }

  return (
    <div className="select-container">
      <label htmlFor="brand-select">Marca:</label>
      <select
        id="brand-select"
        value={state.selectedBrand?._id || ''}
        onChange={handleChange}
        disabled={state.loading}
        className="select-input"
      >
        <option value="">Selecione uma marca</option>
        {filteredBrands.map(brand => (
          <option key={brand._id} value={brand._id}>
            {brand.name}
          </option>
        ))}
      </select>
    </div>
  );
};

import React from 'react';
import { useAppState } from '../../hooks/useAppState';

/**
 * Category selection dropdown - uses categories from state
 */
export const CategorySelect: React.FC = () => {
  const { state, dispatch } = useAppState();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const category = state.categories.find(cat => cat._id === categoryId) || null;
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
  };

  return (
    <div className="select-container">
      <label htmlFor="category-select">Categoria:</label>
      <select
        id="category-select"
        value={state.selectedCategory?._id || ''}
        onChange={handleChange}
        disabled={state.loading}
        className="select-input"
      >
        <option value="">Selecione uma categoria</option>
        {state.categories.map(category => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

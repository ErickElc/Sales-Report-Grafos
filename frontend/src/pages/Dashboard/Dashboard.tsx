import React from 'react';
import { CategorySelect } from '../../components/Selects/CategorySelect';
import { ProductSelect } from '../../components/Selects/ProductSelect';
import { BrandSelect } from '../../components/Selects/BrandSelect';
import { SalesChart } from '../../components/Chart/SalesChart';
import { useAppState } from '../../hooks/useAppState';
import './Dashboard.scss';

export const Dashboard: React.FC = () => {
  const { state } = useAppState();

  // Show loading overlay while data is loading OR data is not yet available
  const isDataReady = state.categories.length > 0 &&
    state.products.length > 0 &&
    state.brands.length > 0 &&
    state.sales.length > 0;

  if (state.loading || !isDataReady) {
    return (
      <div className="dashboard">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Sales Report Dashboard</h1>
      </div>

      <div className="controls-section">
        <div className="filters-container">
          <CategorySelect />
          <ProductSelect />
          <BrandSelect />
        </div>
      </div>

      <SalesChart />
    </div>
  );
};

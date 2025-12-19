import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSales } from '../../hooks/useSales';
import { useAppState } from '../../hooks/useAppState';

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const SalesChart: React.FC = () => {
  const { sales, loading } = useSales();
  const { state } = useAppState();

  const isDataReady = state.categories.length > 0 &&
    state.products.length > 0 &&
    state.brands.length > 0 &&
    sales.length > 0;

  const filteredData = useMemo(() => {
    let filteredSales = sales;
    let title = 'Vendas Totais por Mês';
    let contextName = '';

    if (state.selectedBrand) {
      const brandId = typeof state.selectedBrand === 'object'
        ? state.selectedBrand._id
        : state.selectedBrand;

      filteredSales = sales.filter(sale => {
        const saleBrandId = typeof sale.brandId === 'object'
          ? sale.brandId._id
          : sale.brandId;
        return saleBrandId === brandId;
      });

      const brandName = typeof state.selectedBrand === 'object'
        ? state.selectedBrand.name
        : '';
      title = `Vendas de ${brandName}`;
      contextName = ` (${brandName})`;
    }
    else if (state.selectedProduct) {
      const productId = typeof state.selectedProduct === 'object'
        ? state.selectedProduct._id
        : state.selectedProduct;

      const brandsOfProduct = state.brands.filter(brand => {
        const brandProductId = typeof brand.productId === 'object'
          ? brand.productId._id
          : brand.productId;
        return brandProductId === productId;
      });

      const brandIds = brandsOfProduct.map(b => b._id);

      filteredSales = sales.filter(sale => {
        const saleBrandId = typeof sale.brandId === 'object'
          ? sale.brandId._id
          : sale.brandId;
        return brandIds.includes(saleBrandId);
      });

      const productName = typeof state.selectedProduct === 'object'
        ? state.selectedProduct.name
        : '';
      title = `Vendas de ${productName} (Todas as Marcas)`;
      contextName = ` (${productName})`;
    }
    else if (state.selectedCategory) {
      const categoryId = typeof state.selectedCategory === 'object'
        ? state.selectedCategory._id
        : state.selectedCategory;

      const productsOfCategory = state.products.filter(product => {
        const productCategoryId = typeof product.categoryId === 'object'
          ? product.categoryId._id
          : product.categoryId;
        return productCategoryId === categoryId;
      });

      const productIds = productsOfCategory.map(p => p._id);

      const brandsOfProducts = state.brands.filter(brand => {
        const brandProductId = typeof brand.productId === 'object'
          ? brand.productId._id
          : brand.productId;
        return productIds.includes(brandProductId);
      });

      const brandIds = brandsOfProducts.map(b => b._id);

      filteredSales = sales.filter(sale => {
        const saleBrandId = typeof sale.brandId === 'object'
          ? sale.brandId._id
          : sale.brandId;
        return brandIds.includes(saleBrandId);
      });

      const categoryName = typeof state.selectedCategory === 'object'
        ? state.selectedCategory.name
        : '';
      title = `Vendas de ${categoryName} (Todos os Produtos)`;
      contextName = ` (${categoryName})`;
    }

    const total = filteredSales.reduce((sum, sale) => sum + sale.value, 0);
    const average = filteredSales.length > 0 ? total / filteredSales.length : 0;
    const max = filteredSales.length > 0 ? Math.max(...filteredSales.map(s => s.value)) : 0;
    const min = filteredSales.length > 0 ? Math.min(...filteredSales.map(s => s.value)) : 0;

    const months = [1, 2, 3, 4];
    const salesByMonth = months.map(month => {
      return filteredSales
        .filter(sale => sale.month === month)
        .reduce((sum, sale) => sum + sale.value, 0);
    });

    return { title, contextName, total, average, max, min, salesByMonth };
  }, [sales, state.selectedCategory, state.selectedProduct, state.selectedBrand, state.brands, state.products]);

  const chartOptions = useMemo(() => {
    const categories = [1, 2, 3, 4].map(m => monthNames[m - 1]);

    return {
      chart: {
        type: 'line',
        height: 400,
      },
      title: {
        text: filteredData.title,
      },
      xAxis: {
        categories,
        title: {
          text: 'Mês',
        },
      },
      yAxis: {
        title: {
          text: 'Vendas (R$)',
        },
        min: 0,
      },
      series: [
        {
          name: 'Vendas',
          data: filteredData.salesByMonth,
          color: '#007bff',
        },
      ],
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
    };
  }, [filteredData]);

  if (loading || !isDataReady) {
    return (
      <div className="chart-container" style={{ textAlign: 'center', padding: '40px' }}>
        <p>Carregando dados do gráfico...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="stats-section">
        <div className="stat-card">
          <h4>Total Sales{filteredData.contextName}</h4>
          <p className="stat-value">${filteredData.total.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h4>Average Sales{filteredData.contextName}</h4>
          <p className="stat-value">${filteredData.average.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h4>Maximum Sales{filteredData.contextName}</h4>
          <p className="stat-value">${filteredData.max.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h4>Minimum Sales{filteredData.contextName}</h4>
          <p className="stat-value">${filteredData.min.toFixed(2)}</p>
        </div>
      </div>

      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};

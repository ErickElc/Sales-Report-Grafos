import React, { useState, useEffect } from 'react';
import { useSales } from '../../hooks/useSales';
import { useBrands } from '../../hooks/useBrands';
import { useProducts } from '../../hooks/useProducts';
import type { CreateSaleDto, UpdateSaleDto } from '../../types';
import './SalesPage.scss';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const SalesPage: React.FC = () => {
  const { sales, createSale, updateSale, deleteSale, loading, loadSales } = useSales();
  const { brands, loadBrands } = useBrands();
  const { loadProducts } = useProducts();

  useEffect(() => {
    loadProducts();
    loadBrands();
    loadSales(); // Load all sales
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    brandId: '',
    month: 1,
    value: 0,
    year: new Date().getFullYear()
  });

  const handleOpenModal = (saleId?: string) => {
    if (saleId) {
      const sale = sales.find(s => s._id === saleId);
      if (sale) {
        const brandId = typeof sale.brandId === 'object'
          ? sale.brandId._id
          : sale.brandId;
        setFormData({
          brandId,
          month: sale.month,
          value: sale.value,
          year: sale.year
        });
        setEditingSale(saleId);
      }
    } else {
      setFormData({
        brandId: '',
        month: 1,
        value: 0,
        year: new Date().getFullYear()
      });
      setEditingSale(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      brandId: '',
      month: 1,
      value: 0,
      year: new Date().getFullYear()
    });
    setEditingSale(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSale) {
        const updateData: UpdateSaleDto = {
          month: formData.month,
          value: formData.value,
          year: formData.year
        };
        await updateSale(editingSale, updateData);
      } else {
        const createData: CreateSaleDto = {
          brandId: formData.brandId,
          month: formData.month,
          value: formData.value,
          year: formData.year
        };
        await createSale(createData);
      }
      handleCloseModal();
    } catch (error) {
      // Error handled silently
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await deleteSale(id);
      } catch (error) {
        // Error handled silently
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Sales Management</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          New Sale
        </button>
      </div>

      <div className="crud-container">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Month</th>
              <th>Year</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  No sales found. Create your first sale!
                </td>
              </tr>
            ) : (
              sales.map(sale => {
                const brandName = typeof sale.brandId === 'object'
                  ? sale.brandId.name
                  : brands.find(b => b._id === sale.brandId)?.name || 'N/A';
                return (
                  <tr key={sale._id}>
                    <td>{brandName}</td>
                    <td>{monthNames[sale.month - 1]}</td>
                    <td>{sale.year}</td>
                    <td>${sale.value.toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => handleOpenModal(sale._id)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sale._id)}
                        className="btn-delete"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingSale ? 'Edit Sale' : 'New Sale'}</h3>
            <form onSubmit={handleSubmit}>
              {!editingSale && (
                <div className="form-group">
                  <label htmlFor="sale-brand">Brand:</label>
                  <select
                    id="sale-brand"
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    required
                    className="form-input"
                  >
                    <option value="">Select a brand</option>
                    {brands.map(brand => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="sale-month">Month:</label>
                <select
                  id="sale-month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                  required
                  className="form-input"
                >
                  {monthNames.map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="sale-year">Year:</label>
                <input
                  id="sale-year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                  min="2020"
                  max="2100"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="sale-value">Value:</label>
                <input
                  id="sale-value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  required
                  min="0"
                  step="0.01"
                  className="form-input"
                  placeholder="0.00"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {editingSale ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={handleCloseModal} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


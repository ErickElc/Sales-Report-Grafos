import React, { useState, useEffect } from 'react';
import { useBrands } from '../../hooks/useBrands';
import { useProducts } from '../../hooks/useProducts';
import type { CreateBrandDto, UpdateBrandDto } from '../../types';
import './BrandsPage.scss';

export const BrandsPage: React.FC = () => {
  const { brands, createBrand, updateBrand, deleteBrand, loading, loadBrands } = useBrands();
  const { products, loadProducts } = useProducts();

  useEffect(() => {
    loadProducts();
    loadBrands();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', productId: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort brands
  const filteredBrands = React.useMemo(() => {
    return brands
      .filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [brands, searchTerm]);

  const handleOpenModal = (brandId?: string) => {
    if (brandId) {
      const brand = brands.find(b => b._id === brandId);
      if (brand) {
        const productId = typeof brand.productId === 'object'
          ? brand.productId._id
          : brand.productId;
        setFormData({ name: brand.name, productId });
        setEditingBrand(brandId);
      }
    } else {
      setFormData({ name: '', productId: '' });
      setEditingBrand(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', productId: '' });
    setEditingBrand(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        const updateData: UpdateBrandDto = {
          name: formData.name,
          productId: formData.productId
        };
        await updateBrand(editingBrand, updateData);
      } else {
        const createData: CreateBrandDto = {
          name: formData.name,
          productId: formData.productId
        };
        await createBrand(createData);
      }
      handleCloseModal();
    } catch (error) {
      // Error handled silently
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteBrand(id);
      } catch (error) {
        // Error handled silently
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Brands Management</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          New Brand
        </button>
      </div>

      {/* Search filter */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar marca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ maxWidth: '300px' }}
        />
        {searchTerm && (
          <span style={{ marginLeft: '1rem', color: '#666' }}>
            {filteredBrands.length} resultado(s)
          </span>
        )}
      </div>

      <div className="crud-container">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Product</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
                  {searchTerm ? 'Nenhuma marca encontrada' : 'No brands found. Create your first brand!'}
                </td>
              </tr>
            ) : (
              filteredBrands.map(brand => {
                const productName = typeof brand.productId === 'object'
                  ? brand.productId.name
                  : products.find(p => p._id === brand.productId)?.name || 'N/A';
                return (
                  <tr key={brand._id}>
                    <td>{brand.name}</td>
                    <td>{productName}</td>
                    <td>
                      <button
                        onClick={() => handleOpenModal(brand._id)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(brand._id)}
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
            <h3>{editingBrand ? 'Edit Brand' : 'New Brand'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="brand-name">Name:</label>
                <input
                  id="brand-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input"
                  placeholder="Enter brand name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="brand-product">Product:</label>
                <select
                  id="brand-product"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  required
                  className="form-input"
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {editingBrand ? 'Update' : 'Create'}
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


import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import type { CreateProductDto, UpdateProductDto } from '../../types';
import './ProductsPage.scss';

export const ProductsPage: React.FC = () => {
  const { products, createProduct, updateProduct, deleteProduct, loading, loadProducts } = useProducts();
  const { categories } = useCategories();

  useEffect(() => {
    loadProducts();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', categoryId: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    return products
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, searchTerm]);

  const handleOpenModal = (productId?: string) => {
    if (productId) {
      const product = products.find(p => p._id === productId);
      if (product) {
        const categoryId = typeof product.categoryId === 'object'
          ? product.categoryId._id
          : product.categoryId;
        setFormData({ name: product.name, categoryId });
        setEditingProduct(productId);
      }
    } else {
      setFormData({ name: '', categoryId: '' });
      setEditingProduct(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', categoryId: '' });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const updateData: UpdateProductDto = {
          name: formData.name,
          categoryId: formData.categoryId
        };
        await updateProduct(editingProduct, updateData);
      } else {
        const createData: CreateProductDto = {
          name: formData.name,
          categoryId: formData.categoryId
        };
        await createProduct(createData);
      }
      handleCloseModal();
    } catch (error) {
      // Error handled silently
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        // Error handled silently
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Products Management</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          New Product
        </button>
      </div>

      {/* Search filter */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar produto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ maxWidth: '300px' }}
        />
        {searchTerm && (
          <span style={{ marginLeft: '1rem', color: '#666' }}>
            {filteredProducts.length} resultado(s)
          </span>
        )}
      </div>

      <div className="crud-container">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
                  {searchTerm ? 'Nenhum produto encontrado' : 'No products found. Create your first product!'}
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => {
                const categoryName = typeof product.categoryId === 'object'
                  ? product.categoryId.name
                  : categories.find(c => c._id === product.categoryId)?.name || 'N/A';
                return (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{categoryName}</td>
                    <td>
                      <button
                        onClick={() => handleOpenModal(product._id)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
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
            <h3>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="product-name">Name:</label>
                <input
                  id="product-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input"
                  placeholder="Enter product name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="product-category">Category:</label>
                <select
                  id="product-category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  className="form-input"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {editingProduct ? 'Update' : 'Create'}
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


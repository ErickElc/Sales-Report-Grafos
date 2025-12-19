import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import type { CreateCategoryDto, UpdateCategoryDto } from '../../types';
import './CategoriesPage.scss';

export const CategoriesPage: React.FC = () => {
  const { categories, createCategory, updateCategory, deleteCategory, loading } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort categories
  const filteredCategories = React.useMemo(() => {
    return categories
      .filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, searchTerm]);

  const handleOpenModal = (categoryId?: string) => {
    if (categoryId) {
      const category = categories.find(c => c._id === categoryId);
      if (category) {
        setFormData({ name: category.name });
        setEditingCategory(categoryId);
      }
    } else {
      setFormData({ name: '' });
      setEditingCategory(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '' });
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const updateData: UpdateCategoryDto = { name: formData.name };
        await updateCategory(editingCategory, updateData);
      } else {
        const createData: CreateCategoryDto = { name: formData.name };
        await createCategory(createData);
      }
      handleCloseModal();
    } catch (error) {
      // Error handled silently
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        // Error handled silently
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Categories Management</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          New Category
        </button>
      </div>

      {/* Search filter */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ maxWidth: '300px' }}
        />
        {searchTerm && (
          <span style={{ marginLeft: '1rem', color: '#666' }}>
            {filteredCategories.length} resultado(s)
          </span>
        )}
      </div>

      <div className="crud-container">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: 'center', padding: '2rem' }}>
                  {searchTerm ? 'Nenhuma categoria encontrada' : 'No categories found. Create your first category!'}
                </td>
              </tr>
            ) : (
              filteredCategories.map(category => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>
                    <button
                      onClick={() => handleOpenModal(category._id)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="btn-delete"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCategory ? 'Edit Category' : 'New Category'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="category-name">Name:</label>
                <input
                  id="category-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  required
                  className="form-input"
                  placeholder="Enter category name"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {editingCategory ? 'Update' : 'Create'}
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


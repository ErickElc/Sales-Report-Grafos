import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import type { CreateCategoryDto, UpdateCategoryDto } from '../../types';
import './CategoryCRUD.scss';

export const CategoryCRUD: React.FC = () => {
  const { categories, createCategory, updateCategory, deleteCategory, loading } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '' });

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
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>Categorias</h2>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          Nova Categoria
        </button>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>
                <button
                  onClick={() => handleOpenModal(category._id)}
                  className="btn-edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="btn-delete"
                  disabled={loading}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="category-name">Nome:</label>
                <input
                  id="category-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {editingCategory ? 'Atualizar' : 'Criar'}
                </button>
                <button type="button" onClick={handleCloseModal} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


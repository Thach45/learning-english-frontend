import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, BookOpen, Search } from 'lucide-react';
import { Category } from '../types';
import api from '../utils/api';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalCategory, setModalCategory] = useState({
    id: '',
    name: '',
    description: '',
    icon: '📚',
    color: 'bg-blue-500',
    imageUrl: ''
  });
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null); // id of deleting category
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmEdit, setConfirmEdit] = useState(false);

  // Helper to fetch categories from backend and map safely
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/categories');
      const apiCategories = response.data?.data?.data || [];
      const mapped: Category[] = apiCategories.map((cat: any) => ({
        id: cat.id,
        name: cat.name || '',
        description: cat.description || '',
        icon: cat.icon || '📚',
        color: cat.color || 'bg-blue-500',
        vocabularyCount: 0,
        imageUrl: cat.imageUrl || null,
        totalStudySet: cat.totalStudySet || 0,
      }));
      setCategories(mapped);
    } catch (err: any) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  // Modal submit handler (create or edit)
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!modalCategory.name.trim()) {
      setModalError('Name is required');
      return;
    }
    if (!modalCategory.icon) {
      setModalError('Icon is required');
      return;
    }
    if (!modalCategory.color) {
      setModalError('Color is required');
      return;
    }
    if (modalMode === 'edit') {
      setConfirmEdit(true);
      return;
    }
    await doSaveCategory();
  };

  // Actually save after confirm (edit or create)
  const doSaveCategory = async () => {
    setModalLoading(true);
    try {
      const payload = {
        name: modalCategory.name,
        description: modalCategory.description,
        icon: modalCategory.icon,
        color: modalCategory.color,
        imageUrl: modalCategory.imageUrl || undefined,
      };
      if (modalMode === 'create') {
        await api.post('/categories', payload);
      } else {
        await api.put(`/categories/${modalCategory.id}`, payload);
      }
      setShowModal(false);
      setConfirmEdit(false);
      setModalCategory({ id: '', name: '', description: '', icon: '📚', color: 'bg-blue-500', imageUrl: '' });
      fetchCategories();
    } catch (err: any) {
      setModalError(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setModalLoading(false);
    }
  };

  // Open modal for create
  const openCreateModal = () => {
    setModalMode('create');
    setModalCategory({ id: '', name: '', description: '', icon: '📚', color: 'bg-blue-500', imageUrl: '' });
    setModalError(null);
    setShowModal(true);
  };

  // Open modal for edit
  const handleEditCategory = (category: Category) => {
    setModalMode('edit');
    setModalCategory({
      id: category.id,
      name: category.name || '',
      description: category.description || '',
      icon: category.icon || '📚',
      color: category.color || 'bg-blue-500',
      imageUrl: category.imageUrl || '',
    });
    setModalError(null);
    setShowModal(true);
  };

  // Delete category (show confirm modal)
  const handleDeleteCategory = (id: string) => {
    setConfirmDeleteId(id);
  };

  // Actually delete after confirm
  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoading(confirmDeleteId);
    try {
      await api.delete(`/categories/${confirmDeleteId}`);
      setConfirmDeleteId(null);
      fetchCategories();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(null);
    }
  };


  const iconOptions = ['📚', '💼', '✈️', '💻', '🏠', '❤️', '🎓', '🌍', '🎨', '🔬', '🏃‍♂️', '🍳'];
  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue', color: '#3B82F6' },
    { value: 'bg-green-500', label: 'Green', color: '#22C55E' },
    { value: 'bg-red-500', label: 'Red', color: '#EF4444' },
    { value: 'bg-yellow-500', label: 'Yellow', color: '#EAB308' },
    { value: 'bg-purple-500', label: 'Purple', color: '#A21CAF' },
    { value: 'bg-pink-500', label: 'Pink', color: '#EC4899' },
    { value: 'bg-gray-500', label: 'Gray', color: '#6B7280' },
    { value: 'bg-orange-500', label: 'Orange', color: '#F97316' },
  ];
  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Categories</h1>
          <p className="text-gray-500">Organize your vocabulary by topics and subjects</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Category
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
  <div className="text-center py-12 text-gray-400">Loading categories...</div>
) : error ? (
  <div className="text-center py-12 text-red-500">{error}</div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {filteredCategories.map((category) => (
      <div
        key={category.id}
        className="group bg-white rounded-xl shadow transition-all border border-gray-100 hover:shadow-xl hover:scale-[1.025] p-0 flex flex-col overflow-hidden relative"
      >
        {/* Image or Icon */}
        <div className="flex items-center justify-center h-32 bg-gradient-to-br from-blue-50 to-purple-50 relative">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg bg-gray-100"
            />
          ) : (
            <div className={`w-20 h-20 flex items-center justify-center text-4xl font-bold rounded-full shadow-lg ${category.color} bg-opacity-90 text-white border-4 border-white`}>{category.icon}</div>
          )}
          {/* Edit/Delete buttons (absolute, only visible on hover desktop, always on mobile) */}
          <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
            <button
              onClick={() => handleEditCategory(category)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-blue-100 text-blue-600 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Edit category"
              disabled={deleteLoading === category.id}
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className={`w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-red-100 text-red-600 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 ${deleteLoading === category.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Delete category"
              disabled={deleteLoading === category.id}
            >
              {deleteLoading === category.id ? (
                <span className="w-5 h-5 inline-block animate-spin border-2 border-gray-400 border-t-transparent rounded-full"></span>
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pt-4 pb-6">
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-bold text-gray-900 flex-1 truncate" title={category.name}>{category.name}</h3>
          </div>
          <div className="flex items-center mb-2">
            <BookOpen className="h-5 w-5 text-blue-400 mr-1" />
            <span className="font-semibold text-blue-700 text-sm">{category.totalStudySet} study set{category.totalStudySet === 1 ? '' : 's'}</span>
          </div>
          {category.description && (
            <div className="text-gray-500 text-sm mt-1 line-clamp-2">{category.description}</div>
          )}
        </div>
      </div>
    ))}
  </div>
)}

      {/* Empty State */}
      {!loading && !error && filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? "Try adjusting your search terms." : "No categories available."}
          </p>
        </div>
      )}

      {/* Create/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{modalMode === 'create' ? 'Create New Category' : 'Edit Category'}</h3>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                <input
                  type="text"
                  value={modalCategory.name}
                  onChange={(e) => setModalCategory({ ...modalCategory, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Business English"
                  required
                  disabled={modalLoading}
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={modalCategory.description}
                  onChange={(e) => setModalCategory({ ...modalCategory, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Describe what this category covers..."
                  disabled={modalLoading}
                />
              </div>
              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon *</label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setModalCategory({ ...modalCategory, icon })}
                      className={`p-3 text-xl border-2 rounded-lg transition-colors ${
                        modalCategory.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      disabled={modalLoading}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setModalCategory({ ...modalCategory, color: color.value })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        modalCategory.color === color.value
                          ? 'border-gray-800'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.color }}
                      disabled={modalLoading}
                    >
                      <span className="text-white font-medium text-sm">{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
                <input
                  type="text"
                  value={modalCategory.imageUrl}
                  onChange={(e) => setModalCategory({ ...modalCategory, imageUrl: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                  disabled={modalLoading}
                />
              </div>
              {modalError && <div className="text-red-500 text-sm">{modalError}</div>}
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setModalCategory({ id: '', name: '', description: '', icon: '📚', color: 'bg-blue-500', imageUrl: '' });
                    setModalError(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  disabled={modalLoading}
                >
                  {modalLoading ? (modalMode === 'create' ? 'Creating...' : 'Saving...') : (modalMode === 'create' ? 'Create' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Category</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleteLoading === confirmDeleteId}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
                onClick={confirmDelete}
                disabled={deleteLoading === confirmDeleteId}
              >
                {deleteLoading === confirmDeleteId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Edit Modal (before save) */}
      {confirmEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Edit</h3>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className={`w-8 h-8 ${modalCategory.color} rounded-lg flex items-center justify-center text-xl mr-2`}>{modalCategory.icon}</span>
                <span className="font-bold text-gray-900">{modalCategory.name}</span>
              </div>
              <div className="text-gray-700 text-sm mb-1">{modalCategory.description}</div>
              {modalCategory.imageUrl && <div className="text-xs text-gray-500">Image: {modalCategory.imageUrl}</div>}
            </div>
            <p className="mb-6 text-gray-700">Are you sure you want to save these changes?</p>
            <div className="flex space-x-3">
              <button
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setConfirmEdit(false)}
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
                onClick={doSaveCategory}
                disabled={modalLoading}
              >
                {modalLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Categories;
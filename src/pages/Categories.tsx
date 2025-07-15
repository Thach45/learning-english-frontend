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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: '📚',
    color: 'bg-blue-500',
    imageUrl: ''
  });

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

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!newCategory.name.trim()) {
      setCreateError('Name is required');
      return;
    }
    if (!newCategory.icon) {
      setCreateError('Icon is required');
      return;
    }
    if (!newCategory.color) {
      setCreateError('Color is required');
      return;
    }
    setCreateLoading(true);
    try {
      const payload = {
        name: newCategory.name,
        description: newCategory.description,
        icon: newCategory.icon,
        color: newCategory.color,
        imageUrl: newCategory.imageUrl || undefined,
      };
      await api.post('/categories', payload);
      setShowCreateModal(false);
      setNewCategory({ name: '', description: '', icon: '📚', color: 'bg-blue-500', imageUrl: '' });
      // Fetch categories again to ensure consistency
      fetchCategories();
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || 'Failed to create category');
    } finally {
      setCreateLoading(false);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">Organize your vocabulary by topics and subjects</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
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
        <div className="text-center py-12 text-gray-500">Loading categories...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} className="w-12 h-12 rounded-lg object-cover mr-4" />
                ) : (
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white text-xl mr-4`}>
                    {category.icon}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
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

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Business English"
                  required
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Describe what this category covers..."
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
                      onClick={() => setNewCategory({ ...newCategory, icon })}
                      className={`p-3 text-xl border-2 rounded-lg transition-colors ${
                        newCategory.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
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
                      onClick={() => setNewCategory({ ...newCategory, color: color.value })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        newCategory.color === color.value
                          ? 'border-gray-800'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.color }}
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
                  value={newCategory.imageUrl}
                  onChange={(e) => setNewCategory({ ...newCategory, imageUrl: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
              {createError && <div className="text-red-500 text-sm">{createError}</div>}
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewCategory({ name: '', description: '', icon: '📚', color: 'bg-blue-500', imageUrl: '' });
                    setCreateError(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  disabled={createLoading}
                >
                  {createLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Categories;
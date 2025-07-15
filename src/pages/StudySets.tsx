import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, BookOpen, Users, Lock, Globe, Calendar, User, Eye, X, Pencil, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { StudySet, StudySetResponse } from '../types';

const StudySets: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    tags: [] as string[],
    isPublic: false,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // TODO: fetch categories from API
  const levels = [
    { id: '', name: 'All Levels' },
    { id: 'BEGINNER', name: 'Beginner' },
    { id: 'INTERMEDIATE', name: 'Intermediate' },
    { id: 'ADVANCED', name: 'Advanced' }
  ];

  useEffect(() => {
    const fetchStudySets = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {
          page,
          pageSize,
        };
        if (filterCategory !== 'all') params.category = filterCategory;
        if (searchTerm) params.search = searchTerm;
        // Level filter is frontend only for now
        const res = await api.get('/study-sets', { params });
        api.get('/categories').then(res => {
          setCategories(res.data.data.data.map((cat: any) => ({ id: cat.id, name: cat.name })));
        });
        let dataWithPageSize: StudySetResponse = res.data.data;
        let data: StudySet[] = dataWithPageSize.data;
        if (filterLevel !== 'all') {
          data = data.filter(set => set.level === filterLevel);
        }
        setStudySets(data);
        setTotal(dataWithPageSize.total);
      } catch (err: any) {
        setError('Failed to load study sets');
      } finally {
        setLoading(false);
      }
    };
    fetchStudySets();
  }, [page, pageSize, filterCategory, searchTerm, filterLevel]);

  useEffect(() => {
    if (showCreateModal) {
      setLoadingCategories(true);
      api.get('/categories').then(res => {
        setCategories(res.data.data.data.map((cat: any) => ({ id: cat.id, name: cat.name })));
        setCreateData(prev => ({ ...prev, category: res.data.data.data[0]?.id || '' }));
      }).catch(() => setCategories([])).finally(() => setLoadingCategories(false));
    }
  }, [showCreateModal]);

  const totalPages = Math.ceil(total / pageSize);

  const handleStudySetClick = (studySet: StudySet) => {
    console.log(studySet.id);
    navigate(`/study-sets/${studySet.id}`);
  };

  const handleCreateStudySet = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      if (!createData.title.trim()) {
        alert('Vui lòng nhập tiêu đề');
        setCreateLoading(false);
        return;
      }
      if (!createData.category) {
        alert('Vui lòng chọn chủ đề');
        setCreateLoading(false);
        return;
      }
      let level = 'BEGINNER';
      if (createData.level === 'intermediate') level = 'INTERMEDIATE';
      if (createData.level === 'advanced') level = 'ADVANCED';
      const payload = {
        title: createData.title,
        description: createData.description,
        categoryId: createData.category,
        level,
        tags: createData.tags,
        isPublic: createData.isPublic,
      };
      
      const res = await api.post('/study-sets', payload);
      setShowCreateModal(false);
      setCreateLoading(false);
      setCreateData({ title: '', description: '', category: '', level: 'beginner', tags: [], isPublic: false });
      // Reload danh sách
      setPage(1);
      // Chuyển hướng sang trang chi tiết để thêm từ vựng
    
      navigate(`/study-sets/${res.data.data.data._id}`);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Tạo study set thất bại.');
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/study-sets/${deleteId}`);
      setDeleteId(null);
      // Reload danh sách
      setPage(1);
    } catch (err) {
      alert('Xoá thất bại!');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Sets</h1>
          <p className="text-gray-600">Discover and create vocabulary study sets</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tạo Study Set
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search study sets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {levels.map(level => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>

          {/* My Study Sets Toggle */}
          {/* <label className="flex items-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={false} // This state is no longer needed for filtering
              onChange={(e) => {

              }} // This state is no longer needed for filtering
              className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">My Study Sets</span>
          </label> */}
        </div>
      </div>

      {/* Study Sets Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading study sets...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studySets.map((studySet) => (
              <div
                key={studySet.id}
                onClick={() => handleStudySetClick(studySet)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group relative flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {studySet.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {studySet.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {studySet.isPublic ? (
                      <Globe className="h-5 w-5 text-green-600" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {/* Stats */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {studySet.vocabularyCount} terms
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-1" />
                    {studySet.author?.name || 'User'}
                  </div>
                </div>
                {/* Tags and Level */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      studySet.level === 'beginner' ? 'bg-green-100 text-green-800' :
                      studySet.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {studySet.level}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {typeof studySet.category === 'object' && studySet.category !== null
                        ? studySet.category.name
                        : studySet.category || ''}
                    </span>
                  </div>
                </div>
                {/* Tags */}
                {studySet.tags && studySet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {studySet.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {studySet.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{studySet.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Updated {new Date(studySet.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 rounded-full hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition"
                      title="Chỉnh sửa"
                      onClick={e => { e.stopPropagation(); navigate(`/study-sets/${studySet.id}/edit`); }}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800 transition"
                      title="Xoá"
                      onClick={e => { e.stopPropagation(); setDeleteId(studySet.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="flex items-center ml-2 text-gray-500 hover:text-blue-600" onClick={e => { e.stopPropagation(); handleStudySetClick(studySet); }} title="Học ngay">
                      <Eye className="h-3 w-3 mr-1" />
                      Study
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-blue-100 disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`px-3 py-2 rounded-lg ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                  onClick={() => setPage(p)}
                  disabled={p === page}
                >
                  {p}
                </button>
              ))}
              <button
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-blue-100 disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {/* This section is no longer needed as loading/error states handle empty state */}
      {/* {filteredStudySets.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No study sets found</h3>
          <p className="text-gray-600 mb-6">
            {showMyStudySets 
              ? "You haven't created any study sets yet."
              : "Try adjusting your search or filters."
            }
          </p>
          {showMyStudySets && (
            <button
              onClick={handleCreateStudySet}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Study Set
            </button>
          )}
        </div>
      )} */}

      {/* Quick Stats */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{total}</div>
            <div className="text-sm text-gray-600">Total Study Sets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {studySets.filter(s => s.isPublic).length}
            </div>
            <div className="text-sm text-gray-600">Public Sets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {studySets.filter(s => s.author?.id === 'mockUser.id').length}
            </div>
            <div className="text-sm text-gray-600">Your Sets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {studySets.reduce((sum, set) => sum + set.vocabularyCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Terms</div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setShowCreateModal(false)}><X className="h-5 w-5" /></button>
            <h2 className="text-2xl font-bold mb-4">Tạo Study Set mới</h2>
            <form onSubmit={handleCreateStudySet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
                <input type="text" className="w-full p-3 border rounded-lg" value={createData.title} onChange={e => setCreateData(d => ({ ...d, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea className="w-full p-3 border rounded-lg" value={createData.description} onChange={e => setCreateData(d => ({ ...d, description: e.target.value }))} rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Chủ đề *</label>
                <select className="w-full p-3 border rounded-lg" value={createData.category} onChange={e => setCreateData(d => ({ ...d, category: e.target.value }))} required disabled={loadingCategories}>
                  {loadingCategories ? <option>Đang tải...</option> : categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cấp độ *</label>
                <select className="w-full p-3 border rounded-lg" value={createData.level} onChange={e => setCreateData(d => ({ ...d, level: e.target.value }))} required>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <input type="text" className="w-full p-3 border rounded-lg" value={createData.tags.join(', ')} onChange={e => setCreateData(d => ({ ...d, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) as string[] }))} placeholder="Cách nhau bởi dấu phẩy" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" checked={createData.isPublic} onChange={e => setCreateData(d => ({ ...d, isPublic: e.target.checked }))} />
                <span>Công khai</span>
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium" disabled={createLoading}>{createLoading ? 'Đang tạo...' : 'Tạo Study Set'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận xoá */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setDeleteId(null)}><X className="h-5 w-5" /></button>
            <h2 className="text-xl font-bold mb-4 text-red-600">Xác nhận xoá Study Set?</h2>
            <p className="mb-6">Bạn có chắc chắn muốn xoá bộ từ vựng này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setDeleteId(null)}>Huỷ</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? 'Đang xoá...' : 'Xoá'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySets;
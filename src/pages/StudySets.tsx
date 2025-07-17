import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../utils/api';
import { StudySet, StudySetResponse } from '../types';

import StudySetFilters from '../components/pageStudySets/StudySetFilters';
import CreateStudySetModal from '../components/pageStudySets/CreateStudySetModal';
import DeleteConfirmModal from '../components/pageStudySets/DeleteConfirmModal';
import StudySetStats from '../components/pageStudySets/StudySetStats';
import Pagination from '../components/Pagination';
import EditStudySetModal from '../components/pageStudySets/EditStudySetModal';
import StudySetCard from '../components/pageStudySets/StudySetCard';

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
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudySet, setEditingStudySet] = useState<StudySet | null>(null);

  const levels = [
    { id: '', name: 'All Levels' },
    { id: 'BEGINNER', name: 'Beginner' },
    { id: 'INTERMEDIATE', name: 'Intermediate' },
    { id: 'ADVANCED', name: 'Advanced' }
  ];

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
      
      const res = await api.get('/study-sets', { params });
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

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data.data.map((cat: any) => ({ id: cat.id, name: cat.name })));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchStudySets();
    fetchCategories();
  }, [page, pageSize, filterCategory, searchTerm, filterLevel]);

  const totalPages = Math.ceil(total / pageSize);

  const handleStudySetClick = (studySet: StudySet) => {
    navigate(`/study-sets/${studySet.id}`);
  };

  const handleEditClick = (studySetId: string) => {
    const found = studySets.find(s => s.id === studySetId);
    if (found) {
      setEditingStudySet(found);
      setShowEditModal(true);
    }
  };

  const handleDeleteClick = (studySetId: string) => {
    setDeleteId(studySetId);
  };

  const handleCreateSuccess = (studySetId: string) => {
    setPage(1);
    navigate(`/study-sets/${studySetId}`);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingStudySet(null);
    fetchStudySets();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/study-sets/${deleteId}`);
      setDeleteId(null);
      fetchStudySets();
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

      {/* Filters */}
      <StudySetFilters
        searchTerm={searchTerm}
        filterCategory={filterCategory}
        filterLevel={filterLevel}
        categories={categories}
        levels={levels}
        onSearchChange={setSearchTerm}
        onCategoryChange={setFilterCategory}
        onLevelChange={setFilterLevel}
      />

      {/* Study Sets Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading study sets...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studySets.map((studySet) => (
              <StudySetCard
                key={studySet.id}
                studySet={studySet}
                onStudySetClick={handleStudySetClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
          
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Stats */}
      <StudySetStats studySets={studySets} total={total} />

      {/* Modals */}
      <CreateStudySetModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditStudySetModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingStudySet(null); }}
        onSuccess={handleEditSuccess}
        studySet={editingStudySet}
      />

      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xác nhận xoá Study Set?"
        message="Bạn có chắc chắn muốn xoá bộ từ vựng này? Hành động này không thể hoàn tác."
        loading={deleteLoading}
      />
    </div>
  );
};

export default StudySets;
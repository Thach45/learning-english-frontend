import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, BookOpen,
  Heart, Users, Globe,
  Lock, FolderPlus, Tag, Library, Brain,
  MoreHorizontal, Pencil, Trash2
} from 'lucide-react';

// Types
import { StudySet, Category, Level, CreateCategoryDto, CreateStudySetDto, UpdateCategoryDto, UpdateStudySetDto } from '../types/studySet';

// Hooks
import { useCategories } from '../hooks/useCategories';
import { useStudySets, useFilteredStudySets } from '../hooks/useStudySets';

// Components
import CreateCategoryModal from '../components/pageCategory/CreateCategoryModal';
import CreateStudySetModal from '../components/pageStudySets/CreateStudySetModal';
import EditCategoryModal from '../components/pageCategory/EditCategoryModal';
import EditStudySetModal from '../components/pageStudySets/EditStudySetModal';
import ConfirmDeleteModal from '../components/shared/ConfirmDeleteModal';

// ============================================
// Helper Functions
// ============================================

const getLevelColor = (level: Level) => {
  switch (level) {
    case 'BEGINNER': return 'bg-green-50 text-green-700 border-green-200';
    case 'INTERMEDIATE': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'ADVANCED': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'EXPERT': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-700';
  }
};

// ============================================
// Sub Components
// ============================================

interface CategoryFilterProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  onCreateCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  loading?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
  loading,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const handleOpenMenu = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation();
    if (openMenuId === catId) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      const button = e.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 160, // 160 = dropdown width
      });
      setOpenMenuId(catId);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => onSelectCategory('ALL')}
          className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
            activeCategoryId === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tất cả
        </button>
        
        {categories.map((cat) => (
          <div key={cat.id} className="relative flex-shrink-0 group">
            <div className="flex items-center">
              <button
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-l-lg text-sm font-semibold transition-all border border-r-0 ${
                  activeCategoryId === cat.id
                    ? 'bg-white shadow-md ring-2 ring-offset-1 ring-blue-500 border-transparent'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                style={{ 
                  color: activeCategoryId === cat.id ? cat.color : undefined 
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
              
              {/* Menu Button */}
              <button
                onClick={(e) => handleOpenMenu(e, cat.id)}
                className={`px-2 py-2 rounded-r-lg border transition-all ${
                  activeCategoryId === cat.id
                    ? 'bg-white shadow-md ring-2 ring-offset-1 ring-blue-500 border-transparent'
                    : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-600'
                }`}
              >
                <MoreHorizontal className="w-2 h-2 rotate-90" />
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={onCreateCategory}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-blue-600 border border-dashed border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all"
          title="Tạo danh mục mới"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Danh mục mới</span>
        </button>
      </div>

      {/* Fixed Dropdown Menu - Portal style */}
      {openMenuId && menuPosition && (
        <div
          ref={menuRef}
          className="fixed w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-[99999] overflow-hidden"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <button
            onClick={() => {
              const cat = categories.find(c => c.id === openMenuId);
              if (cat) onEditCategory(cat);
              setOpenMenuId(null);
              setMenuPosition(null);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Pencil className="w-4 h-4 text-slate-400" />
            Chỉnh sửa
          </button>
          <button
            onClick={() => {
              const cat = categories.find(c => c.id === openMenuId);
              if (cat) onDeleteCategory(cat);
              setOpenMenuId(null);
              setMenuPosition(null);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </button>
        </div>
      )}
    </>
  );
};

interface StudySetCardProps {
  studySet: StudySet;
  onClick: () => void;
  onLike?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showProgress?: boolean;
  showActions?: boolean;
}

const StudySetCard: React.FC<StudySetCardProps> = ({
  studySet,
  onClick,
  onLike,
  onEdit,
  onDelete,
  showProgress = false,
  showActions = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const category = studySet.category;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden relative"
    >
      {/* Popular Badge */}
      {studySet.isPublic && studySet.likesCount > 1000 && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 shadow-sm flex items-center gap-1">
          <Heart className="w-3 h-3 fill-yellow-900 text-yellow-900"/> Popular
        </div>
      )}

      <div className="p-6 flex flex-col h-full">
        {/* Category & Actions */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            {category && (
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border bg-opacity-10"
                style={{ 
                  backgroundColor: `${category.color}15`, 
                  color: category.color,
                  borderColor: `${category.color}30`
                }}
              >
                {category.icon} {category.name}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-slate-400" title={studySet.isPublic ? "Công khai" : "Riêng tư"}>
              {studySet.isPublic ? <Globe className="w-4 h-4 text-blue-400" /> : <Lock className="w-4 h-4" />}
            </div>
            
            {/* Actions Menu */}
            {showActions && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                
                {showMenu && (
                  <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4 text-slate-400" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {studySet.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
          {studySet.description || "Không có mô tả"}
        </p>

        {/* Level & Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getLevelColor(studySet.level)}`}>
            {studySet.level}
          </span>
          {studySet.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="flex items-center text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              <Tag className="w-3 h-3 mr-1 opacity-50"/> {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-slate-100 pt-4">
          {/* Author */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 overflow-hidden">
                {studySet.author?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col">
                <span>{studySet.author?.name || 'Unknown'}</span>
                <span className="text-[10px] text-slate-400 font-normal">{studySet.vocabularyCount} từ</span>
              </div>
            </div>
          </div>

          {/* Social Stats or Progress */}
          {showProgress && studySet.progress !== undefined ? (
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
                <span>Tiến độ cá nhân</span>
                <span className={studySet.progress === 100 ? "text-green-600" : "text-blue-600"}>
                  {studySet.progress}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    studySet.progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${studySet.progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); onLike?.(); }}
                  className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-3.5 h-3.5 ${
                    studySet.isLiked ? 'fill-red-400 text-red-400' : 
                    studySet.likesCount > 0 ? 'fill-red-400 text-red-400' : 'text-slate-400'
                  }`} />
                  {studySet.likesCount}
                </button>
                <div className="w-px h-3 bg-slate-300" />
                <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  {studySet.learnersCount} học viên
                </div>
              </div>
              
              {/* Avatar Stack */}
              <div className="flex -space-x-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border border-white bg-slate-200 flex items-center justify-center text-[8px] text-slate-500 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studySet.id}-${i}`} alt="user" />
                  </div>
                ))}
                <div className="w-5 h-5 rounded-full border border-white bg-slate-100 flex items-center justify-center text-[8px] text-slate-500 font-bold">
                  +
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// Main Component
// ============================================

const StudySetDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [activeCategoryId, setActiveCategoryId] = useState<string>('ALL');
  const [activeView, setActiveView] = useState<'community' | 'library'>('community');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showCreateStudySetModal, setShowCreateStudySetModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showEditStudySetModal, setShowEditStudySetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Selected items for edit/delete
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStudySet, setSelectedStudySet] = useState<StudySet | null>(null);
  const [deleteType, setDeleteType] = useState<'category' | 'studyset' | null>(null);
  
  // Loading states
  const [createCategoryLoading, setCreateCategoryLoading] = useState(false);
  const [createStudySetLoading, setCreateStudySetLoading] = useState(false);
  const [editCategoryLoading, setEditCategoryLoading] = useState(false);
  const [editStudySetLoading, setEditStudySetLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Hooks
  const { 
    categories, 
    loading: categoriesLoading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const { 
    studySets, 
    loading: studySetsLoading,
    toggleLike,
    createStudySet,
    updateStudySet,
    deleteStudySet,
    setParams,
  } = useStudySets({
    initialParams: { page: 1, pageSize: 20 },
    mode: activeView === 'community' ? 'enrolled' : 'all',
  });

  // Filtered study sets
  const filteredSets = useFilteredStudySets({
    studySets,
    categoryId: activeCategoryId,
    searchTerm,
    view: activeView,
  });

  // Stats
  const stats = useMemo(() => ({
    totalSets: filteredSets.length,
    totalLearners: filteredSets.reduce((sum, set) => sum + (set.learnersCount || 0), 0),
  }), [filteredSets]);

  // Handlers
  const handleNavigate = (id: string) => {
    navigate(`/study-sets/${id}`);
  };

  const handleCreateCategory = async (data: CreateCategoryDto) => {
    setCreateCategoryLoading(true);
    await createCategory(data);
    setCreateCategoryLoading(false);
  };

  const handleCreateStudySet = async (data: CreateStudySetDto) => {
    setCreateStudySetLoading(true);
    const newSet = await createStudySet(data);
    setCreateStudySetLoading(false);
    if (newSet) {
      navigate(`/study-sets/${newSet.id}`);
    }
  };

  const handleLike = async (id: string) => {
    await toggleLike(id);
  };

  // Edit Category
  const handleOpenEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowEditCategoryModal(true);
  };

  const handleEditCategory = async (id: string, data: UpdateCategoryDto) => {
    setEditCategoryLoading(true);
    await updateCategory(id, data);
    setEditCategoryLoading(false);
  };

  // Delete Category
  const handleOpenDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setDeleteType('category');
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setDeleteLoading(true);
    await deleteCategory(selectedCategory.id);
    setDeleteLoading(false);
    setShowDeleteModal(false);
    setSelectedCategory(null);
    setDeleteType(null);
    // Reset category filter if deleted category was active
    if (activeCategoryId === selectedCategory.id) {
      setActiveCategoryId('ALL');
    }
  };

  // Edit StudySet
  const handleOpenEditStudySet = (studySet: StudySet) => {
    setSelectedStudySet(studySet);
    setShowEditStudySetModal(true);
  };

  const handleEditStudySet = async (id: string, data: UpdateStudySetDto) => {
    setEditStudySetLoading(true);
    await updateStudySet(id, data);
    setEditStudySetLoading(false);
  };

  // Delete StudySet
  const handleOpenDeleteStudySet = (studySet: StudySet) => {
    setSelectedStudySet(studySet);
    setDeleteType('studyset');
    setShowDeleteModal(true);
  };

  const handleDeleteStudySet = async () => {
    if (!selectedStudySet) return;
    setDeleteLoading(true);
    await deleteStudySet(selectedStudySet.id);
    setDeleteLoading(false);
    setShowDeleteModal(false);
    setSelectedStudySet(null);
    setDeleteType(null);
  };

  // Close Delete Modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCategory(null);
    setSelectedStudySet(null);
    setDeleteType(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Hero / Search Section */}
      <div className="border-slate-200 pb-8 pt-6 px-6 sm:px-12 lg:px-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {activeView === 'community' ? 'Khám phá cộng đồng' : 'Thư viện của bạn'}
              </h1>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-full">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500"/> 
                  <span className="text-slate-700">{stats.totalSets} học phần</span>
                </span>
                
                {activeView === 'community' ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-full">
                    <Users className="w-3.5 h-3.5 text-green-500"/> 
                    <span className="text-slate-700">
                      {stats.totalLearners >= 1000 
                        ? `${(stats.totalLearners / 1000).toFixed(1)}k` 
                        : stats.totalLearners
                      } người học
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-full">
                    <Brain className="w-3.5 h-3.5 text-purple-500"/> 
                    <span className="text-slate-700">Đang học</span>
                  </span>
                )}
              </div>
            </div>
            
            {/* View Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto mt-2 md:mt-0">
              <button 
                onClick={() => setActiveView('community')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeView === 'community' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Cộng đồng
              </button>
              <button 
                onClick={() => setActiveView('library')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeView === 'library' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Thư viện của tôi
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            {/* Search Input */}
            <div className="relative w-full max-w-xl group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder={activeView === 'community' ? "Tìm kiếm học phần công khai..." : "Tìm trong thư viện của bạn..."}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelectCategory={setActiveCategoryId}
              onCreateCategory={() => setShowCreateCategoryModal(true)}
              onEditCategory={handleOpenEditCategory}
              onDeleteCategory={handleOpenDeleteCategory}
              loading={categoriesLoading}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          {activeView === 'community' 
            ? <Globe className="w-5 h-5 text-blue-500" /> 
            : <Library className="w-5 h-5 text-slate-500" />
          }
          Danh sách học phần
        </h2>

        {/* Loading State */}
        {studySetsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-5 bg-slate-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-full mb-4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredSets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSets.map((set) => (
              <StudySetCard
                key={set.id}
                studySet={set}
                onClick={() => handleNavigate(set.id)}
                onLike={() => handleLike(set.id)}
                onEdit={() => handleOpenEditStudySet(set)}
                onDelete={() => handleOpenDeleteStudySet(set)}
                showProgress={activeView === 'library'}
                showActions={activeView === 'library'}
              />
            ))}
            
            {/* Create New Card (Library View) */}
            {activeView === 'library' && (
              <button 
                onClick={() => setShowCreateStudySetModal(true)}
                className="group border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-all duration-200 min-h-[320px]"
              >
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors shadow-sm">
                  <Plus className="w-8 h-8 group-hover:scale-110 transition-transform"/>
                </div>
                <span className="font-bold">Tạo học phần mới</span>
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">Không tìm thấy học phần nào</h3>
            <p className="text-slate-500">Thử thay đổi từ khóa hoặc bộ lọc danh mục.</p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveCategoryId('ALL'); }}
              className="mt-4 text-blue-600 hover:underline font-medium"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </main>

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={showCreateCategoryModal}
        onClose={() => setShowCreateCategoryModal(false)}
        onSubmit={handleCreateCategory}
        loading={createCategoryLoading}
      />

      {/* Create Study Set Modal */}
      <CreateStudySetModal
        isOpen={showCreateStudySetModal}
        onClose={() => setShowCreateStudySetModal(false)}
        onSubmit={handleCreateStudySet}
        categories={categories}
        loading={createStudySetLoading}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={showEditCategoryModal}
        onClose={() => {
          setShowEditCategoryModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleEditCategory}
        category={selectedCategory}
        loading={editCategoryLoading}
      />

      {/* Edit Study Set Modal */}
      <EditStudySetModal
        isOpen={showEditStudySetModal}
        onClose={() => {
          setShowEditStudySetModal(false);
          setSelectedStudySet(null);
        }}
        onSubmit={handleEditStudySet}
        studySet={selectedStudySet}
        categories={categories}
        loading={editStudySetLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={deleteType === 'category' ? handleDeleteCategory : handleDeleteStudySet}
        title={deleteType === 'category' ? 'Xóa danh mục' : 'Xóa học phần'}
        message={
          deleteType === 'category'
            ? 'Bạn có chắc chắn muốn xóa danh mục này? Tất cả học phần trong danh mục cũng sẽ bị ảnh hưởng.'
            : 'Bạn có chắc chắn muốn xóa học phần này? Tất cả từ vựng và tiến độ học sẽ bị xóa.'
        }
        itemName={deleteType === 'category' ? selectedCategory?.name : selectedStudySet?.title}
        loading={deleteLoading}
      />
    </div>
  );
};

export default StudySetDashboard;


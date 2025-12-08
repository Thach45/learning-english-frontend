import React, { useState, useEffect } from 'react';
import { X, Globe, Lock, Plus } from 'lucide-react';
import { StudySet, UpdateStudySetDto, Category, Level } from '../../types/studySet';

// ============================================
// Level Options
// ============================================

const LEVEL_OPTIONS: { value: Level; label: string; description: string; color: string }[] = [
  { value: 'BEGINNER', label: 'Beginner', description: 'Người mới', color: '#22C55E' },
  { value: 'INTERMEDIATE', label: 'Intermediate', description: 'Cơ bản', color: '#3B82F6' },
  { value: 'ADVANCED', label: 'Advanced', description: 'Nâng cao', color: '#8B5CF6' },
  { value: 'EXPERT', label: 'Expert', description: 'Chuyên gia', color: '#EF4444' },
];

const SUGGESTED_TAGS = [
  'ielts', 'toeic', 'toefl', 'academic', 'business', 
  'daily', 'travel', 'technology', 'science', 'medicine',
];

// ============================================
// Props Interface
// ============================================

interface EditStudySetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateStudySetDto) => Promise<void>;
  studySet: StudySet | null;
  categories: Category[];
  loading?: boolean;
}

// ============================================
// Component
// ============================================

const EditStudySetModal: React.FC<EditStudySetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  studySet,
  categories,
  loading,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<Level>('BEGINNER');
  const [categoryId, setCategoryId] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showSuggestedTags, setShowSuggestedTags] = useState(false);

  // Populate form when studySet changes
  useEffect(() => {
    if (studySet) {
      setTitle(studySet.title || '');
      setDescription(studySet.description || '');
      setLevel(studySet.level || 'BEGINNER');
      setCategoryId(studySet.categoryId || studySet.category?.id || '');
      setIsPublic(studySet.isPublic || false);
      setTags(studySet.tags || []);
    }
  }, [studySet]);

  if (!isOpen || !studySet) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(studySet.id, {
      title,
      description: description || undefined,
      level,
      categoryId: categoryId || undefined,
      isPublic,
      tags,
    });
    onClose();
  };

  const handleAddTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !tags.includes(normalizedTag) && tags.length < 10) {
      setTags([...tags, normalizedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const filteredSuggestedTags = SUGGESTED_TAGS.filter(
    t => !tags.includes(t) && t.includes(tagInput.toLowerCase())
  );

  const selectedCategory = categories.find(c => c.id === categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Chỉnh sửa học phần</h2>
            <p className="text-sm text-slate-500">Cập nhật thông tin học phần</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 resize-none"
              rows={3}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Danh mục
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    categoryId === cat.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      {cat.icon}
                    </span>
                    <span className="font-medium text-slate-700 text-sm">{cat.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Cấp độ
            </label>
            <div className="grid grid-cols-4 gap-3">
              {LEVEL_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLevel(option.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    level === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div 
                    className="w-3 h-3 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: option.color }}
                  />
                  <p className="font-medium text-slate-700 text-xs">{option.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tags
            </label>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    #{tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  setShowSuggestedTags(true);
                }}
                onKeyDown={handleTagInputKeyDown}
                onFocus={() => setShowSuggestedTags(true)}
                onBlur={() => setTimeout(() => setShowSuggestedTags(false), 200)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                placeholder="Nhập tag..."
                disabled={tags.length >= 10}
              />
              
              {showSuggestedTags && filteredSuggestedTags.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-32 overflow-y-auto">
                  {filteredSuggestedTags.slice(0, 5).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Plus className="w-3 h-3 text-slate-400" />
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Chế độ hiển thị
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  !isPublic ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock className={`w-5 h-5 ${!isPublic ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <p className="font-medium text-slate-700 text-sm">Riêng tư</p>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  isPublic ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe className={`w-5 h-5 ${isPublic ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <p className="font-medium text-slate-700 text-sm">Công khai</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-white transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title}
            className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang lưu...
              </span>
            ) : (
              'Lưu thay đổi'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudySetModal;

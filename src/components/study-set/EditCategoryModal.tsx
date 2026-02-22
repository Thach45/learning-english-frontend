import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles } from 'lucide-react';
import { Category, UpdateCategoryDto } from '../../types/studySet';

// ============================================
// Icon & Color Options (same as CreateCategoryModal)
// ============================================

const ICON_OPTIONS = [
  '📚', '📖', '📝', '✏️', '🎓', '🏫', '📐', '🔬',
  '🗣️', '💬', '🌍', '🌎', '🇬🇧', '🇺🇸', '🇯🇵', '🇰🇷',
  '💻', '🖥️', '📱', '⌨️', '🔧', '⚙️', '🤖', '🧠',
  '💼', '📊', '📈', '💰', '🏢', '📋', '✅', '🎯',
  '🎨', '🎵', '🎬', '📷', '✨', '💡', '🔥', '⭐',
  '🌱', '🌸', '🌻', '🍀', '🌈', '☀️', '🌙', '⚡',
  '🎮', '🎲', '🏆', '🥇', '🚀', '💎', '🎁', '❤️',
];

const COLOR_OPTIONS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Sky', value: '#0EA5E9' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Lime', value: '#84CC16' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Violet', value: '#A855F7' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Slate', value: '#64748B' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Zinc', value: '#71717A' },
  { name: 'Stone', value: '#78716C' },
];

// ============================================
// Props Interface
// ============================================

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateCategoryDto) => Promise<void>;
  category: Category | null;
  loading?: boolean;
}

// ============================================
// Component
// ============================================

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  loading,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📚');
  const [selectedColor, setSelectedColor] = useState('#6366F1');
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Populate form when category changes
  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
      setSelectedIcon(category.icon || '📚');
      setSelectedColor(category.color || '#6366F1');
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(category.id, { 
      name, 
      description: description || undefined,
      icon: selectedIcon,
      color: selectedColor,
    });
    onClose();
  };

  const hasChanges = 
    name !== category.name ||
    description !== (category.description || '') ||
    selectedIcon !== category.icon ||
    selectedColor !== category.color;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${selectedColor}20`, color: selectedColor }}
            >
              {selectedIcon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Chỉnh sửa danh mục</h2>
              <p className="text-sm text-slate-500">Cập nhật thông tin danh mục</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400"
              placeholder="VD: IELTS Vocabulary, Business English..."
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mô tả <span className="text-slate-400 font-normal">(tùy chọn)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400 resize-none"
              placeholder="Mô tả ngắn về danh mục..."
              rows={2}
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Biểu tượng
            </label>
            <div className="space-y-3">
              <div 
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${selectedColor}15` }}
                >
                  {selectedIcon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Icon đã chọn</p>
                  <p className="text-xs text-slate-400">Click để thay đổi</p>
                </div>
                <span className="text-slate-400 text-sm">
                  {showIconPicker ? '▲' : '▼'}
                </span>
              </div>

              {showIconPicker && (
                <div className="grid grid-cols-8 gap-2 p-3 bg-slate-50 rounded-xl max-h-40 overflow-y-auto">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => {
                        setSelectedIcon(icon);
                        setShowIconPicker(false);
                      }}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                        selectedIcon === icon
                          ? 'bg-blue-100 ring-2 ring-blue-500'
                          : 'hover:bg-slate-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Màu sắc
            </label>
            <div className="grid grid-cols-10 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    selectedColor === color.value
                      ? 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-2">Xem trước</p>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm"
                style={{ 
                  backgroundColor: `${selectedColor}15`,
                  color: selectedColor,
                  border: `2px solid ${selectedColor}30`
                }}
              >
                {selectedIcon}
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {name || 'Tên danh mục'}
                </p>
                <p className="text-sm text-slate-500">
                  {description || 'Mô tả danh mục'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !name || !hasChanges}
              className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;


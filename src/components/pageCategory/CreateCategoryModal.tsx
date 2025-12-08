import React, { useState } from 'react';
import { X, Upload, Sparkles } from 'lucide-react';
import { CreateCategoryDto } from '../../types/studySet';

// ============================================
// Icon & Color Options
// ============================================

const ICON_OPTIONS = [
  // Education
  '📚', '📖', '📝', '✏️', '🎓', '🏫', '📐', '🔬',
  // Languages
  '🗣️', '💬', '🌍', '🌎', '🇬🇧', '🇺🇸', '🇯🇵', '🇰🇷',
  // Tech
  '💻', '🖥️', '📱', '⌨️', '🔧', '⚙️', '🤖', '🧠',
  // Business
  '💼', '📊', '📈', '💰', '🏢', '📋', '✅', '🎯',
  // Creative
  '🎨', '🎵', '🎬', '📷', '✨', '💡', '🔥', '⭐',
  // Nature
  '🌱', '🌸', '🌻', '🍀', '🌈', '☀️', '🌙', '⚡',
  // Fun
  '🎮', '🎲', '🏆', '🥇', '🚀', '💎', '🎁', '❤️',
];

const COLOR_OPTIONS = [
  // Blues
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Sky', value: '#0EA5E9' },
  { name: 'Cyan', value: '#06B6D4' },
  // Greens
  { name: 'Green', value: '#22C55E' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Lime', value: '#84CC16' },
  // Warm
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Yellow', value: '#EAB308' },
  // Purple & Pink
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Violet', value: '#A855F7' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Rose', value: '#F43F5E' },
  // Neutral
  { name: 'Slate', value: '#64748B' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Zinc', value: '#71717A' },
  { name: 'Stone', value: '#78716C' },
];

// ============================================
// Props Interface
// ============================================

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryDto) => Promise<void>;
  loading?: boolean;
}

// ============================================
// Component
// ============================================

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📚');
  const [selectedColor, setSelectedColor] = useState('#6366F1');
  const [imageUrl, setImageUrl] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'icon' | 'image'>('icon');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ 
      name, 
      description: description || undefined,
      icon: activeTab === 'icon' ? selectedIcon : '🖼️',
      color: selectedColor,
    });
    // Reset form
    setName('');
    setDescription('');
    setSelectedIcon('📚');
    setSelectedColor('#6366F1');
    setImageUrl('');
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
              {activeTab === 'icon' ? selectedIcon : '🖼️'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tạo danh mục mới</h2>
              <p className="text-sm text-slate-500">Tổ chức học phần của bạn</p>
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

          {/* Icon/Image Tabs */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Biểu tượng
            </label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setActiveTab('icon')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'icon'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                Icon
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('image')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'image'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Hình ảnh
              </button>
            </div>

            {/* Icon Picker */}
            {activeTab === 'icon' && (
              <div className="space-y-3">
                {/* Selected Icon Display */}
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

                {/* Icon Grid */}
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
            )}

            {/* Image Upload */}
            {activeTab === 'image' && (
              <div className="space-y-3">
                {imageUrl ? (
                  <div className="relative">
                    <img 
                      src={imageUrl} 
                      alt="Category" 
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500">Click để upload hình ảnh</span>
                    <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}
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
                {activeTab === 'icon' ? selectedIcon : (imageUrl ? '🖼️' : '📁')}
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
              disabled={loading || !name}
              className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang tạo...
                </span>
              ) : (
                'Tạo danh mục'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryModal;


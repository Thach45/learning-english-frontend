import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../utils/api';

interface CreateStudySetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (studySetId: string) => void;
  defaultCategory?: string;
}

interface CreateData {
  title: string;
  description: string;
  category: string;
  level: string;
  tags: string[];
  isPublic: boolean;
}

const CreateStudySetModal: React.FC<CreateStudySetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultCategory = '',
}) => {
  const [createData, setCreateData] = useState<CreateData>({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    tags: [],
    isPublic: false,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoadingCategories(true);
      api.get('/categories').then(res => {
        const cats = res.data.data.data.map((cat: any) => ({ id: cat.id, name: cat.name }));
        setCategories(cats);
        setCreateData(prev => ({ 
          ...prev, 
          category: defaultCategory || cats[0]?.id || '' 
        }));
      }).catch(() => setCategories([])).finally(() => setLoadingCategories(false));
    }
  }, [isOpen, defaultCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      onSuccess(res.data.data.id);
      onClose();
      setCreateData({ title: '', description: '', category: '', level: 'beginner', tags: [], isPublic: false });
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Tạo study set thất bại.');
    } finally {
      setCreateLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
        <button 
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" 
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Tạo Study Set mới</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-lg" 
              value={createData.title} 
              onChange={e => setCreateData(d => ({ ...d, title: e.target.value }))} 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea 
              className="w-full p-3 border rounded-lg" 
              value={createData.description} 
              onChange={e => setCreateData(d => ({ ...d, description: e.target.value }))} 
              rows={2} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Chủ đề *</label>
            <select 
              className="w-full p-3 border rounded-lg" 
              value={createData.category} 
              onChange={e => setCreateData(d => ({ ...d, category: e.target.value }))} 
              required 
              disabled={loadingCategories}
            >
              {loadingCategories ? (
                <option>Đang tải...</option>
              ) : (
                categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              )}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cấp độ *</label>
            <select 
              className="w-full p-3 border rounded-lg" 
              value={createData.level} 
              onChange={e => setCreateData(d => ({ ...d, level: e.target.value }))} 
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-lg" 
              value={createData.tags.join(', ')} 
              onChange={e => setCreateData(d => ({ 
                ...d, 
                tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) as string[] 
              }))} 
              placeholder="Cách nhau bởi dấu phẩy" 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={createData.isPublic} 
              onChange={e => setCreateData(d => ({ ...d, isPublic: e.target.checked }))} 
            />
            <span>Công khai</span>
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium" 
            disabled={createLoading}
          >
            {createLoading ? 'Đang tạo...' : 'Tạo Study Set'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStudySetModal; 
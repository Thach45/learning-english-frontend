import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../utils/api';
import { StudySet } from '../../types';

interface EditStudySetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studySet: StudySet | null;
}

const EditStudySetModal: React.FC<EditStudySetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  studySet,
}) => {
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    tags: [] as string[],
    isPublic: false,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    if (isOpen && studySet) {
      setEditData({
        title: studySet.title,
        description: studySet.description || '',
        category: typeof studySet.category === 'object' && studySet.category !== null ? studySet.category.id : studySet.category || '',
        level: studySet.level?.toLowerCase() || 'beginner',
        tags: studySet.tags || [],
        isPublic: studySet.isPublic,
      });
      setLoadingCategories(true);
      api.get('/categories').then(res => {
        setCategories(res.data.data.data.map((cat: any) => ({ id: cat.id, name: cat.name })));
      }).catch(() => setCategories([])).finally(() => setLoadingCategories(false));
    }
  }, [isOpen, studySet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studySet) return;
    setEditLoading(true);
    try {
      if (!editData.title.trim()) {
        alert('Vui lòng nhập tiêu đề');
        setEditLoading(false);
        return;
      }
      if (!editData.category) {
        alert('Vui lòng chọn chủ đề');
        setEditLoading(false);
        return;
      }
      let level = 'BEGINNER';
      if (editData.level === 'intermediate') level = 'INTERMEDIATE';
      if (editData.level === 'advanced') level = 'ADVANCED';
      const payload = {
        title: editData.title,
        description: editData.description,
        categoryId: editData.category,
        level,
        tags: editData.tags,
        isPublic: editData.isPublic,
      };
      console.log(payload);
      const res = await api.patch(`/study-sets/${studySet.id}`, payload);
      
    
      onSuccess();
      onClose();
    } catch (error: any) {
        console.log(error?.response.data.message );
      alert(error?.response.data.message || 'Cập nhật study set thất bại.');
    } finally {
      setEditLoading(false);
    }
  };

  if (!isOpen || !studySet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
        <button 
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" 
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Chỉnh sửa Study Set</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
            <input type="text" className="w-full p-3 border rounded-lg" value={editData.title} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea className="w-full p-3 border rounded-lg" value={editData.description} onChange={e => setEditData(d => ({ ...d, description: e.target.value }))} rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Chủ đề *</label>
            <select className="w-full p-3 border rounded-lg" value={editData.category} onChange={e => setEditData(d => ({ ...d, category: e.target.value }))} required disabled={loadingCategories}>
              {loadingCategories ? <option>Đang tải...</option> : categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cấp độ *</label>
            <select className="w-full p-3 border rounded-lg" value={editData.level} onChange={e => setEditData(d => ({ ...d, level: e.target.value }))} required>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input type="text" className="w-full p-3 border rounded-lg" value={editData.tags.join(', ')} onChange={e => setEditData(d => ({ ...d, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) as string[] }))} placeholder="Cách nhau bởi dấu phẩy" />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={editData.isPublic} onChange={e => setEditData(d => ({ ...d, isPublic: e.target.checked }))} />
            <span>Công khai</span>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium" disabled={editLoading}>{editLoading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
        </form>
      </div>
    </div>
  );
};

export default EditStudySetModal; 
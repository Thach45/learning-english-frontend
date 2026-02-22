import React from 'react';
import { X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button 
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" 
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-4 text-red-600">{title}</h2>
        <p className="mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button 
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" 
            onClick={onClose}
            disabled={loading}
          >
            Huỷ
          </button>
          <button 
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Đang xoá...' : 'Xoá'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 
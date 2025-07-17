import React from "react";

interface ConfirmEditModalProps {
  open: boolean;
  category: {
    name: string;
    description: string;
    icon: string;
    color: string;
    imageUrl: string;
  };
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const ConfirmEditModal: React.FC<ConfirmEditModalProps> = ({ open, category, onCancel, onConfirm, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Confirm Edit
        </h3>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span
              className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center text-xl mr-2`}
            >
              {category.icon}
            </span>
            <span className="font-bold text-gray-900">
              {category.name}
            </span>
          </div>
          <div className="text-gray-700 text-sm mb-1">
            {category.description}
          </div>
          {category.imageUrl && (
            <div className="text-xs text-gray-500">
              Image: {category.imageUrl}
            </div>
          )}
        </div>
        <p className="mb-6 text-gray-700">
          Are you sure you want to save these changes?
        </p>
        <div className="flex space-x-3">
          <button
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEditModal; 
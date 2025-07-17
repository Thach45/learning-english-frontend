import React from "react";
import { Category } from "../../types";

interface CategoryModalProps {
  open: boolean;
  mode: "create" | "edit";
  category: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    imageUrl: string;
  };
  onChange: (cat: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  iconOptions: string[];
  colorOptions: { value: string; label: string; color: string }[];
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  mode,
  category,
  onChange,
  onClose,
  onSubmit,
  loading,
  error,
  iconOptions,
  colorOptions,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {mode === "create" ? "Create New Category" : "Edit Category"}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={category.name}
              onChange={e => onChange({ ...category, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Business English"
              required
              disabled={loading}
            />
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={category.description}
              onChange={e => onChange({ ...category, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="Describe what this category covers..."
              disabled={loading}
            />
          </div>
          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon *
            </label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => onChange({ ...category, icon })}
                  className={`p-3 text-xl border-2 rounded-lg transition-colors ${
                    category.icon === icon
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  disabled={loading}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => onChange({ ...category, color: color.value })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    category.color === color.value
                      ? "border-gray-800"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color.color }}
                  disabled={loading}
                >
                  <span className="text-white font-medium text-sm">
                    {color.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (optional)
            </label>
            <input
              type="text"
              value={category.imageUrl}
              onChange={e => onChange({ ...category, imageUrl: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://..."
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                ? "Create"
                : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal; 
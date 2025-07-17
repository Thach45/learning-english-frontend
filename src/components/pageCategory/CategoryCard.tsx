import React from "react";
import { Edit, Trash2, BookOpen, ChevronDown, PlusCircle } from "lucide-react";
import { Category } from "../../types";

interface StudySet {
  id: string;
  title: string;
}

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onViewStudySets: (category: Category, page: number) => void;
  onCreateStudySet: (categoryId: string) => void;
  expanded: boolean;
  onToggleExpand: (categoryId: string) => void;
  studySets: StudySet[];
  loadingStudySets: boolean;
  navigate: (path: string) => void;
  deleteLoading: string | null;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  onViewStudySets,
  onCreateStudySet,
  expanded,
  onToggleExpand,
  studySets,
  loadingStudySets,
  navigate,
  deleteLoading,
}) => {
  return (
    <div
      className="group bg-white rounded-xl shadow transition-all border border-gray-100 hover:shadow-xl hover:scale-[1.025] p-0 flex flex-col overflow-hidden relative"
    >
      {/* Image or Icon */}
      <div className="flex items-center justify-center h-32 bg-gradient-to-br from-blue-50 to-purple-50 relative">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg bg-gray-100"
          />
        ) : (
          <div
            className={`w-20 h-20 flex items-center justify-center text-4xl font-bold rounded-full shadow-lg ${category.color} bg-opacity-90 text-white border-4 border-white`}
          >
            {category.icon}
          </div>
        )}
        {/* Edit/Delete buttons */}
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
          <button
            onClick={() => onEdit(category)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-blue-100 text-blue-600 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Edit category"
            disabled={deleteLoading === category.id}
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className={`w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-red-100 text-red-600 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 ${
              deleteLoading === category.id ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Delete category"
            disabled={deleteLoading === category.id}
          >
            {deleteLoading === category.id ? (
              <span className="w-5 h-5 inline-block animate-spin border-2 border-gray-400 border-t-transparent rounded-full"></span>
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-4 pb-6">
        <div className="flex items-center mb-2">
          <h3
            className="text-xl font-bold text-gray-900 flex-1 truncate"
            title={category.name}
          >
            {category.name}
          </h3>
        </div>
        <div className="flex items-center mb-2">
          <BookOpen className="h-5 w-5 text-blue-400 mr-1" />
          <span className="font-semibold text-blue-700 text-sm">
            {category.totalStudySet} study set
            {category.totalStudySet === 1 ? "" : "s"}
          </span>
        </div>
        {category.description && (
          <div className="text-gray-500 text-sm mt-1 line-clamp-2">
            {category.description}
          </div>
        )}
        {/* Action buttons */}
        <div className="flex items-center mt-4 space-x-2">
          <button
            className="flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium"
            onClick={() => onViewStudySets(category, 1)}
          >
            <ChevronDown className="w-4 h-4 mr-1" />
            View Study Sets
          </button>
          <button
            className="flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm font-medium"
            onClick={() => onCreateStudySet(category.id)}
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            Create Study Set
          </button>
        </div>
        {/* Collapse study sets list */}
        {expanded && (
          <div className="mt-4 bg-gray-50 rounded p-3 border border-gray-200">
            {loadingStudySets ? (
              <div className="text-gray-400 text-sm">Loading study sets...</div>
            ) : studySets.length ? (
              <ul className="space-y-1">
                {studySets.map((ss) => (
                  <li key={ss.id}>
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => navigate(`/study-sets/${ss.id}`)}
                    >
                      {ss.title}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">No study sets in this category.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCard; 
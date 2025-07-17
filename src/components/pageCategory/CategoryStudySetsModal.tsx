import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

interface CategoryStudySetsModalProps {
  open: boolean;
  category: any;
  studySets: any[];
  loading: boolean;
  onClose: () => void;
  onViewStudySet: (id: string) => void;
  onCreateStudySet: (categoryId: string) => void;
}

const CategoryStudySetsModal: React.FC<CategoryStudySetsModalProps> = ({
  open,
  category,
  studySets,
  loading,
  onClose,
  onViewStudySet,
  onCreateStudySet,
}) => {
  const [visibleCount, setVisibleCount] = useState(4);
  useEffect(() => {
    if (open) setVisibleCount(4);
  }, [open]);
  if (!open || !category) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative max-h-[80vh]">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="text-2xl">&times;</span>
        </button>
        <h3 className="text-xl font-bold mb-4">
          Study Sets in "{category.name}"
        </h3>
        {loading ? (
          <div className="text-gray-400 text-center py-8">
            Loading study sets...
          </div>
        ) : studySets.length ? (
          <div className="space-y-4 mb-4 max-h-[50vh] overflow-y-auto">
            {studySets.slice(0, visibleCount).map((ss) => (
              <div
                key={ss.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition flex flex-col cursor-pointer"
                onClick={() => {
                  onClose();
                  onViewStudySet(ss.id);
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-bold text-blue-800 line-clamp-1">
                    {ss.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ml-2 ${
                      ss.level === "BEGINNER"
                        ? "bg-green-100 text-green-700"
                        : ss.level === "INTERMEDIATE"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ss.level}
                  </span>
                  {ss.isPublic ? (
                    <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                      Public
                    </span>
                  ) : (
                    <span className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-gray-600 text-xs font-medium">
                      Private
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-1 space-x-4">
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {ss.vocabularyCount} terms
                  </span>
                  <span className="flex items-center">
                    <span className="mr-1">{ss.likesCount}</span>
                    <span role="img" aria-label="likes">
                      ❤️
                    </span>
                  </span>
                  <span className="text-xs text-gray-400">
                    {ss.createdAt
                      ? new Date(ss.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                {ss.tags && ss.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ss.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {visibleCount < studySets.length && (
              <div className="flex justify-center">
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base"
                  onClick={() => setVisibleCount(visibleCount + 4)}
                >
                  Xem thêm
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            No study sets in this category.
          </div>
        )}
        {category && (
          <button
            className="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-base"
            onClick={() => onCreateStudySet(category.id)}
          >
            + Create Study Set
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryStudySetsModal; 
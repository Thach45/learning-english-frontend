import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { StudySet } from '../../types/studySet';
import { useStudySets } from '../../hooks/useStudySets';

interface StudySetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId?: string;
  onSelect: (set: StudySet) => void;
}

const PAGE_SIZE_INIT = 5;
const PAGE_SIZE_ALL = 100;

const StudySetPickerModal: React.FC<StudySetPickerModalProps> = ({
  isOpen,
  onClose,
  selectedId,
  onSelect,
}) => {
  const [pageSize, setPageSize] = useState(PAGE_SIZE_INIT);

  const { studySets, loading, total, setParams } = useStudySets({
    initialParams: { page: 1, pageSize: PAGE_SIZE_INIT },
    autoFetch: isOpen,
  });

  // Khi mở modal hoặc thay đổi pageSize → fetch lại
  useEffect(() => {
    if (isOpen) {
      setParams({ page: 1, pageSize });
    }
  }, [isOpen, pageSize, setParams]);

  // Reset pageSize khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setPageSize(PAGE_SIZE_INIT);
    }
  }, [isOpen]);

  // Khoá scroll body khi modal mở
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const hasMore = studySets.length < total;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white w-full max-w-lg rounded-2xl shadow-lg border border-gray-200 max-h-[80vh] flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Chọn bộ từ vựng để chia sẻ
              {total > 0 && (
                <span className="text-xs font-normal text-gray-400 ml-2">({total} bộ)</span>
              )}
            </h3>
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-4 py-3 text-xs text-gray-500 border-b border-gray-50">
            Chỉ hiển thị các bộ từ vựng của bạn. Chọn một bộ để gắn vào bài viết.
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2 space-y-2">
            {loading && studySets.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              </div>
            )}
            {!loading && studySets.length === 0 && (
              <div className="text-xs text-gray-500 text-center py-6">
                Bạn chưa có bộ từ vựng nào. Hãy tạo một bộ trong trang Học tập trước.
              </div>
            )}
            {studySets.map((set) => (
              <button
                key={set.id}
                type="button"
                onClick={() => onSelect(set)}
                className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-colors ${
                  selectedId === set.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/40'
                }`}
              >
                <div className="font-semibold text-gray-900 line-clamp-1">{set.title}</div>
                <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                  {set.vocabularyCount} thuật ngữ • {set.isPublic ? 'Công khai' : 'Riêng tư'}
                </div>
              </button>
            ))}

            {/* Xem tất cả */}
            {hasMore && !loading && (
              <button
                type="button"
                onClick={() => setPageSize(PAGE_SIZE_ALL)}
                className="w-full py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Xem tất cả ({total} bộ)
              </button>
            )}
            {loading && studySets.length > 0 && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudySetPickerModal;

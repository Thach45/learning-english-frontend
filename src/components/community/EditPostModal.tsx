import React, { useEffect, useState } from 'react';
import { BookOpen, RefreshCw, X } from 'lucide-react';
import { useUpdatePost } from '../../hooks/useCommunity';
import { FeedType, FeedAttachmentStudySet, UpdatePostPayload } from '../../types/community';
import { StudySet } from '../../types/studySet';
import StudySetPickerModal from './StudySetPickerModal';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  initialContent: string;
  postType: FeedType;
  currentStudySet?: FeedAttachmentStudySet;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  postId,
  initialContent,
  postType,
  currentStudySet,
}) => {
  const [content, setContent] = useState(initialContent);
  const [selectedStudySet, setSelectedStudySet] = useState<StudySet | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const updateMutation = useUpdatePost(postId);

  // Reset state khi modal mở
  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
      setSelectedStudySet(null);
    }
  }, [isOpen, initialContent]);

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

  // StudySet hiện tại hiển thị (ưu tiên cái mới chọn, nếu không thì cái cũ)
  const displayStudySet = selectedStudySet
    ? { title: selectedStudySet.title, termCount: selectedStudySet.vocabularyCount, id: selectedStudySet.id }
    : currentStudySet
      ? { title: currentStudySet.title, termCount: currentStudySet.termCount, id: currentStudySet.id }
      : null;

  const handleSave = () => {
    const payload: UpdatePostPayload = { content };
    if (postType === 'study_set_shared' && selectedStudySet) {
      payload.sharedStudySetId = selectedStudySet.id;
    }
    updateMutation.mutate(payload, { onSuccess: () => onClose() });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Sửa bài viết</h3>
            <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Nội dung bài viết..."
            />

            {/* Study Set section - chỉ hiện khi type là study_set_shared */}
            {postType === 'study_set_shared' && displayStudySet && (
              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-indigo-700 line-clamp-1">
                      {displayStudySet.title}
                    </div>
                    <div className="text-[11px] text-indigo-500">
                      {displayStudySet.termCount} từ vựng
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Đổi
                </button>
              </div>
            )}

            {postType === 'study_set_shared' && !displayStudySet && (
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-indigo-600 bg-indigo-50 border border-dashed border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Chọn bộ từ vựng để chia sẻ
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Huỷ
            </button>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending || !content.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </div>
      </div>

      {/* Study Set Picker */}
      <StudySetPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedId={selectedStudySet?.id ?? currentStudySet?.id}
        onSelect={(set) => {
          setSelectedStudySet(set);
          setIsPickerOpen(false);
        }}
      />
    </>
  );
};

export default EditPostModal;

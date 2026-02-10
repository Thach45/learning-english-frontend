import React, { useState } from 'react';
import { BookOpen, Image, Send, X } from 'lucide-react';
import { StudySet } from '../../types/studySet';
import { User } from '../../types';
import StudySetPickerModal from './StudySetPickerModal';

type Privacy = 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE';


interface CreatePostBoxProps {
  currentUser: User;
  onPost: (payload: { content: string; privacy: Privacy; type: string; sharedStudySetId?: string }) => Promise<void>;
  isSubmitting?: boolean;
}

const PRIVACY_MAP: { value: Privacy; label: string }[] = [
  { value: 'PUBLIC', label: 'Công khai' },
  { value: 'FOLLOWERS_ONLY', label: 'Chỉ bạn bè' },
  { value: 'PRIVATE', label: 'Riêng tư' },
];

const CreatePostBox: React.FC<CreatePostBoxProps> = ({ currentUser, onPost, isSubmitting }) => {
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<Privacy>('PUBLIC');
  const [selectedStudySet, setSelectedStudySet] = useState<StudySet | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    await onPost({
      content: content.trim(),
      privacy,
      type: selectedStudySet ? 'STUDY_SET_SHARE' : 'USER_POST',
      sharedStudySetId: selectedStudySet?.id,
    });
    setContent('');
    setSelectedStudySet(null);
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex gap-3">
        <img
          src={currentUser.avatarUrl ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.name}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full bg-indigo-50"
        />
        <div className="flex-1">
          <div className="bg-gray-50 rounded-xl p-3 mb-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <textarea
              className="w-full bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-500 resize-none h-10 focus:h-20 transition-all"
              placeholder="Hôm nay bạn học được gì mới? Chia sẻ ngay..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative group"
                title="Thêm hình ảnh"
              >
                <Image className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative group"
                title="Chia sẻ bộ từ vựng của bạn"
              >
                <BookOpen className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-full px-1 py-0.5">
                {PRIVACY_MAP.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPrivacy(opt.value)}
                    className={`px-2 py-0.5 text-[11px] rounded-full font-medium transition-colors ${
                      privacy === opt.value
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handlePost}
                disabled={!content.trim() || isSubmitting}
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-3 h-3" />
                {isSubmitting ? 'Đang đăng...' : 'Đăng'}
              </button>
            </div>
          </div>
          {selectedStudySet && (
            <div className="mt-2 flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-xs">
              <div>
                <div className="font-semibold text-indigo-700 line-clamp-1">
                  Đang chia sẻ: {selectedStudySet.title}
                </div>
                <div className="text-[11px] text-indigo-500">
                  {selectedStudySet.vocabularyCount} thuật ngữ • {selectedStudySet.isPublic ? 'Công khai' : 'Riêng tư'}
                </div>
              </div>
              <button
                type="button"
                className="p-1 text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100 rounded-full"
                onClick={() => setSelectedStudySet(null)}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          </div>
        </div>

      {/* Study set picker modal */}
      <StudySetPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedId={selectedStudySet?.id}
        onSelect={(set) => {
          setSelectedStudySet(set);
          setIsPickerOpen(false);
        }}
      />
    </div>
  );
};

export default CreatePostBox;


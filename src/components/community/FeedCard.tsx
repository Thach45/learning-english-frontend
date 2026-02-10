import React, { useRef, useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Heart, MessageSquare, MoreHorizontal, Users, Pencil, Trash2 } from 'lucide-react';
import { FeedItem } from '../../types/community';
import { useReactPost, useDeletePost } from '../../hooks/useCommunity';
import studySetService from '../../services/studySetService';
import EditPostModal from './EditPostModal';
import CommentList from './CommentList';

interface FeedCardProps {
  item: FeedItem;
  currentUserId?: string;
}

const FeedCard: React.FC<FeedCardProps> = ({ item, currentUserId }) => {
  const { mutateAsync: reactToPost } = useReactPost();
  const deleteMutation = useDeletePost();
  const [likes, setLikes] = useState(item.likes);
  const [isLiked, setIsLiked] = useState<boolean>(!!item.isLiked);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(!!item.studySet?.isEnrolled);
  const [learners, setLearners] = useState<number>(item.studySet?.learnersCount ?? 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync likes state with props when feed updates (e.g. comment count changed)
  useEffect(() => {
    setLikes(item.likes);
    setIsLiked(!!item.isLiked);
  }, [item.likes, item.isLiked]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleToggleLike = async () => {
    const currentLikes = likes;
    const currentIsLiked = isLiked;
    if (currentIsLiked) {
      setLikes(currentLikes - 1);
      setIsLiked(false);
      await reactToPost(item.id);
    } else {
      setLikes(currentLikes + 1);
      setIsLiked(true);
      await reactToPost(item.id);
    }
  };

  const handleEnrollOrLearn = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.studySet) return;

    if (!isEnrolled) {
      try {
        const res = await studySetService.enroll(item.studySet.id);
        if (res.enrolled) {
          setIsEnrolled(true);
          setLearners((prev) => prev + 1);
        }
      } catch (error) {
        console.error('Failed to enroll study set from community:', error);
      }
    } else {
      // TODO: điều hướng sang màn học bộ này nếu cần (VD: /vocabularies?studySetId=...)
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3">
        <a href={`/profile/${item.user.id}`} className="relative">
          <img
            src={item.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user.name}`}
            alt={item.user.name}
            className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200"
          />
          {item.user.level != null && (
            <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-[10px] font-bold px-1.5 rounded-full border border-white">
              {item.user.level}
            </div>
          )}
        </a>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="leading-snug">
              <span className="font-bold text-gray-900 text-sm hover:underline cursor-pointer">
                {item.user.name}
              </span>
              <span className="text-gray-500 text-sm ml-1">
                {item.type === 'post' || item.type === 'study_set_shared' ? 'đã đăng bài viết' : item.content}
              </span>
            </div>
            
            {item.user.isAuthor && (
              <div className="relative" ref={menuRef}>
                <button
                  className="text-gray-400 hover:text-gray-600 p-1"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 z-20 w-36 bg-white border border-gray-200 rounded-xl shadow-lg py-1">
                    <button
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setMenuOpen(false);
                        setEditModalOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" /> Sửa bài
                    </button>
                    <button
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setMenuOpen(false);
                        if (window.confirm('Bạn có chắc muốn xoá bài viết này?')) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" /> Xoá bài
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400 block mt-0.5">{item.timestamp}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="mt-3 ml-13 pl-13">
        {/* User Post/Share Content */}
        {(item.type === 'post' || item.type === 'study_set_shared') && (
          <div className="mb-3 text-sm text-gray-700 whitespace-pre-line">{item.content}</div>
        )}

        {/* Study Set Attachment */}
       
        {item.studySet && (
          <div className="mt-3 mb-3 border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-indigo-50/30 transition-colors cursor-pointer group/card shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm group-hover/card:text-indigo-600 transition-colors line-clamp-1">
                    {item.studySet.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>{item.studySet.termCount} từ vựng</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {item.studySet.author}
                    </span>
                    {learners > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-indigo-500" /> {learners} học viên
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover/card:text-indigo-500 transition-colors" />
            </div>
            {item.studySet.description && (
              <p className="text-xs text-gray-600 mt-3 line-clamp-2 pl-1 border-l-2 border-indigo-100">
                {item.studySet.description}
              </p>
            )}
            <button
              type="button"
              onClick={handleEnrollOrLearn}
              className="w-full mt-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              {isEnrolled ? 'Học ngay' : 'Tham gia để học'}
            </button>
          </div>
        )}

        {/* Post Image */}
        {item.image && (
          <div className="mb-3 rounded-xl overflow-hidden border border-gray-100">
            <img src={item.image} alt="Post content" className="w-full h-64 object-cover" />
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center gap-6 mt-2 pt-2">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors group ${
              isLiked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-600'
            }`}
          >
            <div className={`p-1.5 rounded-full group-hover:bg-pink-50 ${isLiked ? 'bg-pink-50' : ''}`}>
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            {likes}
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors group"
          >
            <div className={`p-1.5 rounded-full group-hover:bg-indigo-50 ${showComments ? 'bg-indigo-50 text-indigo-600' : ''}`}>
              <MessageSquare className="w-4 h-4" />
            </div>
            {item.comments}
          </button>
        </div>

        {/* Comment Section */}
        {showComments && (
          <CommentList 
            postId={item.id} 
            postAuthorId={item.user.id}
            currentUserId={currentUserId}
          />
        )}
      </div>

      {/* Edit Modal */}
      <EditPostModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        postId={item.id}
        initialContent={item.content}
        postType={item.type}
        currentStudySet={item.studySet}
      />
    </div>
  );
};

export default FeedCard;


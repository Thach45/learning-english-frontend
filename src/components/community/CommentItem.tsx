import React, { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Comment } from '../../types/community';
import { useUpdateComment, useDeleteComment } from '../../hooks/useCommunity';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string; // To check permissions (or use comment.isAuthor)
  postAuthorId?: string; // To check if current user is post author (can delete any comment)
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, currentUserId, postAuthorId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [menuOpen, setMenuOpen] = useState(false);

  const updateMutation = useUpdateComment();
  const deleteMutation = useDeleteComment();

  // Check permissions
  const isAuthor = comment.isAuthor; // Or comment.author.id === currentUserId
  const isPostAuthor = currentUserId === postAuthorId;
  
  // Can delete: Author of comment OR Author of post
  const canDelete = isAuthor || isPostAuthor;
  // Can edit: Only Author of comment
  const canEdit = isAuthor;

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    await updateMutation.mutateAsync({ id: comment.id, content: editContent });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xoá bình luận này?')) {
      await deleteMutation.mutateAsync({ id: comment.id, postId: comment.postId });
    }
  };

  return (
    <div className="flex gap-3 group">
      <img
        src={comment.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.name}`}
        alt={comment.author.name}
        className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-2xl px-4 py-2 relative inline-block min-w-[200px] max-w-full">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-sm text-gray-900">{comment.author.name}</span>
            <span className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          {isEditing ? (
            <div className="mt-1">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                rows={2}
                autoFocus
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleUpdate}
                  className="text-xs text-indigo-600 font-medium hover:text-indigo-700"
                  disabled={updateMutation.isPending}
                >
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          )}

          {/* Actions Menu */}
          {!isEditing && (canEdit || canDelete) && (
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
                
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-6 z-20 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                      {canEdit && (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            setIsEditing(true);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          <Pencil className="w-3 h-3" /> Sửa
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            handleDelete();
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" /> Xoá
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;

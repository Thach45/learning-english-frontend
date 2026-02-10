import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useComments, useAddComment } from '../../hooks/useCommunity';
import CommentItem from './CommentItem';

interface CommentListProps {
  postId: string;
  postAuthorId: string;
  currentUserId?: string; // Should be passed from parent or context
}

const CommentList: React.FC<CommentListProps> = ({ postId, postAuthorId, currentUserId }) => {
  const [content, setContent] = useState('');
  const { data, isLoading, isError, hasNextPage, fetchNextPage } = useComments(postId);
  const addMutation = useAddComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await addMutation.mutateAsync({ postId, content });
    setContent('');
  };

  if (isLoading) return <div className="text-center py-4 text-sm text-gray-500">Đang tải bình luận...</div>;
  if (isError) return <div className="text-center py-4 text-sm text-red-500">Lỗi khi tải bình luận</div>;

  const comments = data?.items || [];

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
         {/* Placeholder for current user avatar - ideally passed or fetched */}
         <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold text-xs">
           ME
         </div>
         <div className="flex-1 relative">
           <input
             type="text"
             value={content}
             onChange={(e) => setContent(e.target.value)}
             placeholder="Viết bình luận..."
             className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-10"
             disabled={addMutation.isPending}
           />
           <button
             type="submit"
             disabled={!content.trim() || addMutation.isPending}
             className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-indigo-600 hover:bg-indigo-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <Send className="w-4 h-4" />
           </button>
         </div>
      </form>

      {/* List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            postAuthorId={postAuthorId}
          />
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-sm italic">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </div>
        )}
      </div>
      
      {/* Load More (Basic implementation) */}
       {/* If we implemented infinite scroll in hook, we would use it here. 
           For now, the hook handles simple pagination but mapped to single page.
           We might want to extend the hook or UI later for "Load more".
       */}
    </div>
  );
};

export default CommentList;

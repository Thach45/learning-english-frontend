import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchFeed,
  createPost,
  reactToPost,
  addComment,
  fetchLeaderboard,
  followUser,
  unfollowUser,
  checkFollow,
  listFollowers,
  listFollowering,
  updatePost,
  deletePost,
  fetchComments,
  updateComment,
  deleteComment,
} from '../services/communityService';
import { FeedItem, FeedPagination, UpdatePostPayload } from '../types/community';
import { useNotification } from '../context/NotificationContext';

type FeedResponse = {
  items: FeedItem[];
  pagination: FeedPagination;
  isFinished: boolean;
};

export function useCommunityFeed(params?: { page?: number; pageSize?: number; filter?: 'all' | 'posts' }) {
  return useQuery<FeedResponse>({
    queryKey: ['community', 'feed', params] as const,
    queryFn: () => fetchFeed(params),
  });
}

export function useUpdatePost(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePostPayload) => updatePost(postId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
      addNotification({ type: 'success', title: 'Thành công', message: 'Đã xoá bài viết' });
    },
  });
}
export function useLeaderboard() {
  return useQuery({
    queryKey: ['community', 'leaderboard'] as const,
    queryFn: fetchLeaderboard,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
      addNotification({ type: 'success', title: 'Thành công', message: 'Đã tạo bài viết' });
    },
  });
}

export function useReactPost() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: (postId: string) =>
      reactToPost(postId),
    onSuccess: (res) => {
      // optimistic invalidation
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
      addNotification({ type: 'success', title: 'Thành công', message: 'Đã thích bài viết' });
      return res;
    },
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: addComment,
    onSuccess: (res) => {
      // Invalidate feed to update comment count
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
      // Invalidate specific post comments
      qc.invalidateQueries({ queryKey: ['community', 'comments', res.postId] });
      addNotification({ type: 'success', title: 'Thành công', message: 'Đã thêm bình luận' });
    },
  });
}

export function useComments(postId: string, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['community', 'comments', postId, page, pageSize],
    queryFn: () => fetchComments(postId, page, pageSize),
    enabled: !!postId,
  });
}

export function useUpdateComment() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => 
      updateComment(id, content),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['community', 'comments', res.postId] });
      addNotification({ type: 'success', title: 'Thành công', message: 'Đã sửa bình luận' });
    },
  });
}

export function useDeleteComment() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: ({ id }: { id: string; postId: string }) => 
      deleteComment(id),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
      qc.invalidateQueries({ queryKey: ['community', 'comments', variables.postId] });
      addNotification({ type: 'success', title: 'Thành công', message: 'Đã xoá bình luận' });
    },
  });
}

export function useFollowUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
      qc.invalidateQueries({ queryKey: ['community', 'check-follow'] });
      qc.invalidateQueries({ queryKey: ['community', 'list-followers'] });
    },
  });
}

export function useUnfollowUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
      qc.invalidateQueries({ queryKey: ['community', 'check-follow'] });
      qc.invalidateQueries({ queryKey: ['community', 'list-followers'] });
      qc.invalidateQueries({ queryKey: ['community', 'list-following'] });
    },
  });
}

export function useCheckFollow(userId: string) {
  return useQuery({
    queryKey: ['community', 'check-follow', userId],
    queryFn: () => checkFollow(userId),
  });
}

export function useListFollowers(page: number, pageSize: number)  {
  return useQuery({
    queryKey: ['community', 'list-followers', page, pageSize],
    queryFn: () => listFollowers(page, pageSize),
  });
}

export function useListFollowing(page: number, pageSize: number)  {
  return useQuery({
    queryKey: ['community', 'list-following', page, pageSize],
    queryFn: () => listFollowering(page, pageSize),
  });
}
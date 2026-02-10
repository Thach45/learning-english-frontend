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
} from '../services/communityService';
import { FeedItem, FeedPagination, UpdatePostPayload } from '../types/community';

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
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
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
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
    },
  });
}

export function useReactPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      reactToPost(postId),
    onSuccess: (res) => {
      // optimistic invalidation
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
      return res;
    },
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchFeed,
  createPost,
  reactToPost,
  addComment,
  fetchLeaderboard,
  toggleFollow,
} from '../services/communityService';
import { FeedItem, FeedPagination, ReactionType } from '../types/community';

type FeedResponse = {
  items: FeedItem[];
  pagination: FeedPagination;
};

export const COMMUNITY_KEYS = {
  feed: (params?: { page?: number; pageSize?: number; filter?: 'all' | 'posts' }) =>
    ['community', 'feed', params] as const,
  leaderboard: ['community', 'leaderboard'] as const,
};

export function useCommunityFeed(params?: { page?: number; pageSize?: number; filter?: 'all' | 'posts' }) {
  return useQuery<FeedResponse>({
    queryKey: COMMUNITY_KEYS.feed(params),
    queryFn: () => fetchFeed(params),
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: COMMUNITY_KEYS.leaderboard,
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

export function useToggleFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleFollow,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['community', 'feed'] });
    },
  });
}


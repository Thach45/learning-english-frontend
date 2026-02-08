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
} from '../services/communityService';
import { FeedItem, FeedPagination } from '../types/community';

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
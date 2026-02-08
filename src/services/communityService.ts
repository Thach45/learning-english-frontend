import api from '../utils/api';
import {
  FeedItem,
  FeedPagination,
  CreatePostPayload,
  CommentPayload,
  LeaderboardUser,
  ReactionType,
} from '../types/community';

type FeedResponse = {
  items: FeedItem[];
  pagination: FeedPagination;
};

const unwrap = <T>(res: any): T => (res?.data?.data.data ? res.data.data.data : res.data.data);

/**
 * Expected backend response:
 * {
 *   "data": {
 *     "items": FeedItem[],
 *     "pagination": { page, pageSize, total }
 *   }
 * }
 */
export async function fetchFeed(params?: {
  page?: number;
  pageSize?: number;
  filter?: 'all' | 'posts';
}) {
  const res = await api.get('/community/feed', { params });
  return unwrap<FeedResponse>(res);
}

/**
 * Expected backend response:
 * {
 *   "data": FeedItem
 * }
 */
export async function createPost(payload: CreatePostPayload) {
  const res = await api.post('/community/posts', payload);
  return unwrap<FeedItem>(res);
}

/**
 * Expected backend response:
 * {
 *   "data": { postId, likes, isLiked }
 * }
 */
export async function reactToPost(postId: string) {
  const res = await api.put(`/community/posts/${postId}/react`);
  return unwrap<{ postId: string; likes: number; isLiked: boolean }>(res);
}

/**
 * Expected backend response:
 * {
 *   "data": { postId, comments }
 * }
 */
export async function addComment(payload: CommentPayload) {
  const res = await api.post(`/community/posts/${payload.postId}/comments`, {
    content: payload.content,
    parentCommentId: payload.parentCommentId,
  });
  return unwrap<{ postId: string; comments: number }>(res);
}

/**
 * Expected backend response:
 * {
 *   "data": LeaderboardUser[]
 * }
 */
export async function fetchLeaderboard() {
  const res = await api.get('/community/leaderboard');
  return unwrap<LeaderboardUser[]>(res);
}

/**
 * Optional: follow / unfollow author.
 * Expected backend response:
 * { "data": { userId, isFollowing } }
 */
export async function toggleFollow(userId: string) {
  const res = await api.post('/community/follow', { userId });
  return unwrap<{ userId: string; isFollowing: boolean }>(res);
}


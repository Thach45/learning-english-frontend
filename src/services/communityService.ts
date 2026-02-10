import api from '../utils/api';
import {
  FeedItem,
  FeedPagination,
  CreatePostPayload,
  CommentPayload,
  LeaderboardUser,
  
  ListFollowersResponseDto,
  CheckFollowResponseDto,
  UpdatePostPayload,
  UpdatePostResponseDto,
} from '../types/community';

type FeedResponse = {
  items: FeedItem[];
  pagination: FeedPagination;
  isFinished: boolean;
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
 * Follow user (PUT users/:id/follow).
 * Expected: { "data": { userId, isFollowing: true } }
 */
export async function followUser(userId: string) {
  const res = await api.put(`/community/users/${userId}/follow`);
  return unwrap<{ userId: string; isFollowing: boolean }>(res);
}

/**
 * Unfollow user (PUT users/:id/unfollow).
 * Expected: { "data": { userId, isFollowing: false } }
 */
export async function unfollowUser(userId: string) {
  const res = await api.put(`/community/users/${userId}/unfollow`);
  return unwrap<{ userId: string; isFollowing: boolean }>(res);
}

export async function listFollowers(page: number, pageSize: number) {
  const res = await api.get(`/community/list-followers`, { params: { page, pageSize } });
  return unwrap<ListFollowersResponseDto>(res);
}
export async function listFollowering(page: number, pageSize: number) {
  const res = await api.get(`/community/list-following`, { params: { page, pageSize } });
  return unwrap<ListFollowersResponseDto>(res);
}

export async function checkFollow(userId: string) {
  const res = await api.get(`/community/users/${userId}/check-follow`);
  return unwrap<CheckFollowResponseDto>(res);
}

export async function updatePost(postId: string, payload: UpdatePostPayload) {
  const res = await api.put(`/community/posts/${postId}`, payload);
  return unwrap<UpdatePostResponseDto>(res);
}

export async function deletePost(postId: string) {
  const res = await api.delete(`/community/posts/${postId}`);
  return unwrap<{ message: string }>(res);
}
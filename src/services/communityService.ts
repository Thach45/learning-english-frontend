import api from '../config/api';
import {
  FeedItem,
  FeedPagination,
  CreatePostPayload,
  CommentPayload,
  LeaderboardUser,
  Comment,
  GetCommentsResponse,
  DeleteCommentResponse,
  
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
 *   "data": Comment
 * }
 */
export async function addComment(payload: CommentPayload) {
  const res = await api.post(`/community/posts/${payload.postId}/comments`, {
    content: payload.content,
  });
  return unwrap<Comment>(res);
}

export async function fetchComments(postId: string, page = 1, pageSize = 20) {
  const res = await api.get(`/community/posts/${postId}/comments`, {
    params: { page, pageSize },
  });
  return unwrap<GetCommentsResponse>(res);
}

export async function updateComment(commentId: string, content: string) {
  const res = await api.put(`/community/comments/${commentId}`, { content });
  return unwrap<Comment>(res);
}

export async function deleteComment(commentId: string) {
  const res = await api.delete(`/community/comments/${commentId}`);
  return unwrap<DeleteCommentResponse>(res);
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
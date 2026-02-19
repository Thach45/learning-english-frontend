export interface AdminPagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface AdminStats {
  totalUsers: number;
  newUsersInRange: number;
  totalPosts: number;
  totalComments: number;
  from?: string;
  to?: string;
}

export interface AdminRole {
  id: string;
  name: string;
  displayName: string;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  level: number;
  status: string;
  createdAt: string;
  roles: AdminRole[];
}

export interface AdminUserDetail extends AdminUserItem {
  xp: number;
  streak: number;
  updatedAt: string;
}

export interface GetUsersResponse {
  items: AdminUserItem[];
  pagination: AdminPagination;
}

export interface AdminAuthor {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface AdminPostItem {
  id: string;
  authorId: string;
  content: string | null;
  imageUrls: string[];
  type: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  author: AdminAuthor;
}

export interface AdminCommentAuthor {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface AdminCommentInPost {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
  author: AdminCommentAuthor;
}

export interface AdminPostDetail extends AdminPostItem {
  comments: AdminCommentInPost[];
}

export interface GetPostsResponse {
  items: AdminPostItem[];
  pagination: AdminPagination;
}

export interface AdminPostSummary {
  id: string;
  content: string | null;
}

export interface AdminCommentItem {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
  author: AdminCommentAuthor;
  post: AdminPostSummary;
}

export interface GetCommentsResponse {
  items: AdminCommentItem[];
  pagination: AdminPagination;
}

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface GetPostsParams {
  page?: number;
  pageSize?: number;
  authorId?: string;
  from?: string;
  to?: string;
}

export interface GetCommentsParams {
  page?: number;
  pageSize?: number;
  postId?: string;
  authorId?: string;
}

export interface UpdateUserRolePayload {
  roleId?: string;
  roleName?: string;
}

export interface UpdateUserStatusPayload {
  status: string;
}

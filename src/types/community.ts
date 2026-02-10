export type FeedType = 'post' | 'study_set_shared';

export interface FeedUser {
  id: string;
  name: string;
  avatarUrl?: string;
  level?: number;
  isAuthor?: boolean;
}

export interface FeedAttachmentStudySet {
  id: string;
  title: string;
  termCount: number;
  author: string;
  description?: string;
  isPublic?: boolean;
  likesCount?: number;
  categoryId?: string;
  level?: string;
  tags?: string[];
   learnersCount?: number;
   isEnrolled?: boolean;
}

export interface FeedItem {
  id: string;
  type: FeedType;
  user: FeedUser;
  content: string;
  image?: string;
  studySet?: FeedAttachmentStudySet;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;

}

export interface FeedPagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  rank: number;
  change: 'up' | 'down' | 'same';
}

export interface CreatePostPayload {
  content: string;
  imageUrls?: string[];
  type?: 'USER_POST' | 'STUDY_SET_SHARE';
  privacy?: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE';
  sharedStudySetId?: string;
  metadata?: Record<string, any>;
}

export interface CommentPayload {
  postId: string;
  content: string;
  parentCommentId?: string;
}

export interface ListFollowersResponseDto {
  items: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    level?: number;
  }[];
  total: number;
  page: number;
  pageSize: number;
}
export type ReactionType = 'like' | 'love' | 'insight';

export type CheckFollowType = 'FOLLOW' | 'UNFOLLOW' | "ME";
export interface CheckFollowResponseDto {
  type: CheckFollowType;
}
export type UpdatePostPayload  ={
  content?: string;
  imageUrls?: string[];
  sharedStudySetId?: string;
  privacy?: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE';
 }
export type UpdatePostResponseDto = {
  message: string;
}
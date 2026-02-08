import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  Heart,
  Globe,
  Lock,
  ArrowUp,
  ArrowDown,
  Minus,
  Bell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreatePost, useCommunityFeed } from '../hooks/useCommunity';
import { FeedItem, LeaderboardUser } from '../types/community';
import { useStudySets } from '../hooks/useStudySets';
import FeedCard from '../components/community/FeedCard';
import CreatePostBox from '../components/community/CreatePostBox';


const CURRENT_USER = {
  id: 'me',
  name: 'Minh Dev',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh',
  level: 5,
  xp: 2450,
  publicProfile: true,
  totalLikesReceived: 128
};

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { id: 'u1', name: 'Sarah Nguyen', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', xp: 5200, level: 8, rank: 1, change: 'same' },
  { id: 'u2', name: 'David Tran', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', xp: 4800, level: 7, rank: 2, change: 'up' },
  { id: 'u3', name: 'John Doe', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', xp: 4500, level: 7, rank: 3, change: 'down' },
  { id: 'me', name: 'Minh Dev', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh', xp: 2450, level: 5, rank: 14, change: 'up' },
  { id: 'u5', name: 'Alice Wonder', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', xp: 2100, level: 4, rank: 15, change: 'down' },
];



// --- MAIN COMPONENT ---
const UserProgressDashboard: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'posts'>('all');
  const { data: feedData, isLoading: feedLoading } = useCommunityFeed({ page: 1, pageSize: 20, filter });
  const createPostMutation = useCreatePost();
  const { studySets: myStudySets } = useStudySets({ initialParams: { page: 1, pageSize: 50 } });

  const feedItems = useMemo<FeedItem[]>(() => {
    if (feedData?.items) return feedData.items;
    return [];
  }, [feedData]);

  const handleNewPost = async (payload: { content: string; privacy: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE'; type: string; sharedStudySetId?: string }) => {
    const { content, privacy, type, sharedStudySetId } = payload;
    await createPostMutation.mutateAsync({
      content,
      type: payload.type as 'USER_POST' | 'STUDY_SET_SHARE',
      privacy,
      sharedStudySetId,
      
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cộng đồng học tập</h1>
            <p className="text-gray-500 text-sm mt-1">Cập nhật hoạt động và thành tích từ bạn bè.</p>
          </div>
          
          <button className="relative p-2 text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-gray-50"></span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: FEED --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Create Post */}
            <CreatePostBox
              currentUser={CURRENT_USER}
              myStudySets={myStudySets}
              onPost={handleNewPost}
              isSubmitting={createPostMutation.isPending}
            />

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                Tất cả
              </button>
              
              <button 
                onClick={() => setFilter('posts')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'posts' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                Thảo luận
              </button>
            </div>

            {/* Feed List */}
            <div className="space-y-4">
              {feedLoading && (
                <div className="space-y-3">
                  {[1,2].map(i => (
                    <div key={i} className="h-32 bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse" />
                  ))}
                </div>
              )}
              <AnimatePresence>
        {feedItems
          .filter(item => {
            if (filter === 'all') return true;
            if (filter === 'posts') return item.type === 'post' || item.type === 'study_set_shared';
            return true;
          })
          .map(item => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <FeedCard item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Load More */}
            <div className="text-center py-4">
              <button className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                Xem thêm hoạt động cũ hơn
              </button>
            </div>
          </div>

          {/* --- RIGHT COLUMN: SIDEBAR --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Leaderboard Widget */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  BXH Tuần
                </h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase">Top 5</span>
              </div>

              <div>
                {MOCK_LEADERBOARD.slice(0, 5).map((user, index) => {
                  const isMe = user.id === CURRENT_USER.id;
                  const top3 = index < 3;
                  
                  return (
                    <div 
                      key={user.id}
                      className={`
                        flex items-center px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors
                        ${isMe ? 'bg-indigo-50/50' : ''}
                      `}
                    >
                      <div className="w-8 font-bold text-gray-400 text-center text-sm">
                        {top3 ? (
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow-sm mx-auto
                            ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'}
                          `}>
                            {index + 1}
                          </div>
                        ) : (
                          <span>{user.rank}</span>
                        )}
                      </div>
                      
                      <div className="flex-1 flex items-center gap-3 ml-2">
                        <img src={user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh'} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200" />
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-sm truncate ${isMe ? 'text-indigo-700' : 'text-gray-900'}`}>
                            {user.name} {isMe && '(Bạn)'}
                          </h4>
                          <p className="text-xs text-gray-500">Level {user.level}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-sm">{user.xp.toLocaleString()}</div>
                        <div className={`text-[10px] font-medium flex items-center justify-end gap-0.5 ${
                          user.change === 'up' ? 'text-green-600' : 
                          user.change === 'down' ? 'text-red-500' : 'text-gray-400'
                        }`}>
                          {user.change === 'up' && <ArrowUp className="w-3 h-3" />}
                          {user.change === 'down' && <ArrowDown className="w-3 h-3" />}
                          {user.change === 'same' && <Minus className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
                <button className="text-xs font-bold text-indigo-600 hover:underline">Xem bảng xếp hạng đầy đủ</button>
              </div>
            </div>

            {/* Social Stats Widget */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Thống kê của bạn</h4>
                  <p className="text-xs text-gray-500">Mức độ ảnh hưởng</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <span className="text-sm text-gray-600">Tổng lượt thích</span>
                  <span className="font-bold text-gray-900">{CURRENT_USER.totalLikesReceived}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <span className="text-sm text-gray-600">Trạng thái hồ sơ</span>
                  <div className="flex items-center gap-1.5">
                    {CURRENT_USER.publicProfile ? <Globe className="w-3 h-3 text-green-600" /> : <Lock className="w-3 h-3 text-gray-500" />}
                    <span className={`text-xs font-bold ${CURRENT_USER.publicProfile ? 'text-green-700' : 'text-gray-600'}`}>
                      {CURRENT_USER.publicProfile ? 'Công khai' : 'Riêng tư'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProgressDashboard;
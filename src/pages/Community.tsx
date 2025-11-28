import React, { useState } from 'react';
import { 
  Flame, Zap, TrendingUp, Heart, Globe, Lock,
  ArrowUp, ArrowDown, Minus, MessageSquare, 
  MoreHorizontal, Image, Send, Filter, Bell,
  BookOpen, ExternalLink, Trophy, X,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES (Mapped from Prisma Schema) ---

// Thông tin bộ từ vựng được share
interface SharedStudySet {
  id: string;
  title: string;
  termCount: number;
  author: string;
  description?: string;
}

// Thông tin thành tựu được share
interface SharedAchievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  xpEarned: number;
}

// Feed Activity Type - Dựa trên XPEvent & UserAchievement
interface ActivityFeedItem {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
    level: number;
  };
  type: 'achievement' | 'level_up' | 'streak_milestone' | 'post' | 'study_set_shared'; 
  content: string;
  image?: string; // Cho bài đăng có ảnh
  studySet?: SharedStudySet; // Cho bài đăng share bộ từ vựng
  achievement?: SharedAchievement; // Cho bài đăng share thành tựu
  meta?: {
    icon?: React.ReactNode;
    color?: string;
    badgeName?: string;
    xpEarned?: number;
  };
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

// Leaderboard User
interface LeaderboardUser {
  id: string;
  name: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  rank: number;
  change: 'up' | 'down' | 'same';
}

// --- MOCK DATA ---

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

const INITIAL_FEED: ActivityFeedItem[] = [
  {
    id: 'f0',
    user: { name: 'Minh Dev', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh', level: 5 },
    type: 'study_set_shared',
    content: 'Mình vừa tạo bộ từ vựng mới về chủ đề "Business English", mọi người cùng học nhé! 👇',
    studySet: {
      id: 'ss1',
      title: 'Essential Business English',
      termCount: 45,
      author: 'Minh Dev',
      description: 'Các từ vựng thông dụng trong môi trường công sở, đàm phán và viết email.'
    },
    timestamp: 'Vừa xong',
    likes: 0,
    comments: 0,
    isLiked: false
  },
  {
    id: 'f1',
    user: { name: 'Sarah Nguyen', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', level: 8 },
    type: 'achievement',
    content: 'đã mở khóa danh hiệu "Bậc thầy ôn tập"!',
    meta: { 
      icon: <Zap className="w-4 h-4 text-purple-600" />, 
      color: 'bg-purple-100', 
      badgeName: 'Epic Badge',
      xpEarned: 1000
    },
    timestamp: '2 giờ trước',
    likes: 24,
    comments: 5,
    isLiked: false
  },
  {
    id: 'f2',
    user: { name: 'David Tran', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', level: 7 },
    type: 'streak_milestone',
    content: 'đã đạt chuỗi Streak 30 ngày liên tiếp! 🔥 Quá dữ!',
    meta: { 
      icon: <Flame className="w-4 h-4 text-orange-600" />, 
      color: 'bg-orange-100',
      xpEarned: 500
    },
    timestamp: '5 giờ trước',
    likes: 156,
    comments: 12,
    isLiked: true
  },
  {
    id: 'f3',
    user: { name: 'John Doe', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', level: 7 },
    type: 'post',
    content: 'Mình vừa tìm thấy bộ Flashcard IELTS Speaking Part 1 này hay lắm, mọi người tham khảo nhé. Có kèm audio phát âm chuẩn.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000',
    timestamp: '1 ngày trước',
    likes: 42,
    comments: 8,
    isLiked: false
  },
];

// Mock Achievement để demo attach
const DEMO_ACHIEVEMENT: SharedAchievement = {
  id: 'ach_1',
  title: 'Thói quen thép',
  description: 'Duy trì chuỗi Streak 7 ngày liên tiếp',
  icon: <Flame className="w-6 h-6 text-orange-500" />,
  color: 'bg-orange-100',
  xpEarned: 500
};

// --- COMPONENTS ---

const FeedCard: React.FC<{ item: ActivityFeedItem }> = ({ item }) => {
  const [liked, setLiked] = useState(item.isLiked);
  const [likesCount, setLikesCount] = useState(item.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative">
          <img src={item.user.avatarUrl} alt={item.user.name} className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200" />
          <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-[10px] font-bold px-1.5 rounded-full border border-white">
            {item.user.level}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="leading-snug">
              <span className="font-bold text-gray-900 text-sm hover:underline cursor-pointer">{item.user.name}</span>
              <span className="text-gray-500 text-sm ml-1">{item.type === 'post' || item.type === 'study_set_shared' ? 'đã đăng bài viết' : item.content}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-gray-400 block mt-0.5">{item.timestamp}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="mt-3 ml-13 pl-13"> 
        
        {/* User Post/Share Content */}
        {(item.type === 'post' || item.type === 'study_set_shared' || item.type === 'achievement') && (
          <div className="mb-3 text-sm text-gray-700 whitespace-pre-line">
            {item.content}
          </div>
        )}

        {/* Study Set Attachment */}
        {item.studySet && (
          <div className="mt-3 mb-3 border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-indigo-50/30 transition-colors cursor-pointer group/card shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm group-hover/card:text-indigo-600 transition-colors line-clamp-1">{item.studySet.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>{item.studySet.termCount} từ vựng</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {item.studySet.author}</span>
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover/card:text-indigo-500 transition-colors" />
            </div>
            {item.studySet.description && (
              <p className="text-xs text-gray-600 mt-3 line-clamp-2 pl-1 border-l-2 border-indigo-100">
                {item.studySet.description}
              </p>
            )}
            <button className="w-full mt-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors">
              Học ngay
            </button>
          </div>
        )}

        {/* Achievement Attachment (User Shared) */}
        {item.achievement && (
          <div className="mt-3 mb-3 border border-yellow-200 bg-yellow-50/50 rounded-xl p-4 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md bg-white border border-yellow-100`}>
                  {item.achievement.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-yellow-600 uppercase tracking-wide mb-0.5">Thành tựu mới</div>
                  <h4 className="font-bold text-gray-900 text-sm">{item.achievement.title}</h4>
                  <p className="text-xs text-gray-500">{item.achievement.description}</p>
                </div>
             </div>
             <div className="text-right">
                <span className="text-sm font-bold text-yellow-600">+{item.achievement.xpEarned} XP</span>
             </div>
          </div>
        )}

        {/* Post Image */}
        {item.image && (
          <div className="mb-3 rounded-xl overflow-hidden border border-gray-100">
            <img src={item.image} alt="Post content" className="w-full h-64 object-cover" />
          </div>
        )}

        {/* System Event Meta Box (Automatic) */}
        {item.meta && (
          <div className={`mt-2 mb-3 flex items-center justify-between p-3 rounded-xl ${item.meta.color} bg-opacity-30 border border-gray-100/50`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm`}>
                {item.meta.icon}
              </div>
              <div className="flex flex-col">
                {item.meta.badgeName && <span className="text-xs font-bold uppercase tracking-wide text-gray-800">{item.meta.badgeName}</span>}
                <span className="text-xs text-gray-600 font-medium">{item.type === 'streak_milestone' ? 'Streak Master' : 'System Event'}</span>
              </div>
            </div>
            {item.meta.xpEarned && (
              <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                +{item.meta.xpEarned} XP
              </span>
            )}
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center gap-6 mt-2 pt-2">
          <button 
            onClick={toggleLike}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors group ${liked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-600'}`}
          >
            <div className={`p-1.5 rounded-full group-hover:bg-pink-50 ${liked ? 'bg-pink-50' : ''}`}>
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </div>
            {likesCount}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors group">
            <div className="p-1.5 rounded-full group-hover:bg-indigo-50">
              <MessageSquare className="w-4 h-4" />
            </div>
            {item.comments}
          </button>
        </div>
      </div>
    </div>
  );
};

const CreatePostBox: React.FC<{ onPost: (content: string, attachment: any) => void }> = ({ onPost }) => {
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState<any>(null); // Stores study set or achievement

  const handleAttachAchievement = () => {
    // Simulate picking an achievement
    setAttachment({ type: 'achievement', data: DEMO_ACHIEVEMENT });
  };

  const handleClearAttachment = () => setAttachment(null);

  const handlePost = () => {
    if (!content && !attachment) return;
    onPost(content, attachment);
    setContent('');
    setAttachment(null);
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex gap-3">
        <img src={CURRENT_USER.avatarUrl} alt="Me" className="w-10 h-10 rounded-full bg-indigo-50" />
        <div className="flex-1">
          <div className="bg-gray-50 rounded-xl p-3 mb-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <textarea
              className="w-full bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-500 resize-none h-10 focus:h-20 transition-all"
              placeholder="Hôm nay bạn học được gì mới? Chia sẻ ngay..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            {/* Attachment Preview */}
            <AnimatePresence>
              {attachment && attachment.type === 'achievement' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white rounded-full shadow-sm">{attachment.data.icon}</div>
                    <div className="text-xs">
                      <div className="font-bold text-gray-800">{attachment.data.title}</div>
                      <div className="text-gray-500">Thành tựu • +{attachment.data.xpEarned} XP</div>
                    </div>
                  </div>
                  <button onClick={handleClearAttachment} className="p-1 hover:bg-yellow-100 rounded-full text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative group" title="Thêm hình ảnh">
                <Image className="w-5 h-5" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative group" title="Chia sẻ bộ từ vựng">
                <BookOpen className="w-5 h-5" />
              </button>
              <button 
                onClick={handleAttachAchievement}
                className={`p-1.5 rounded-lg transition-colors relative group ${attachment ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'}`}
                title="Chia sẻ thành tựu"
              >
                <Trophy className="w-5 h-5" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Share Achievement
                </span>
              </button>
            </div>
            <button 
              onClick={handlePost}
              disabled={!content && !attachment}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-3 h-3" />
              Đăng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const UserProgressDashboard: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'achievements' | 'posts'>('all');
  const [feedItems, setFeedItems] = useState<ActivityFeedItem[]>(INITIAL_FEED);

  const handleNewPost = (content: string, attachment: any) => {
    const newItem: ActivityFeedItem = {
      id: `new_${Date.now()}`,
      user: { name: CURRENT_USER.name, avatarUrl: CURRENT_USER.avatarUrl, level: CURRENT_USER.level },
      type: attachment?.type === 'achievement' ? 'achievement' : 'post',
      content: content,
      timestamp: 'Vừa xong',
      likes: 0,
      comments: 0,
      isLiked: false,
      achievement: attachment?.type === 'achievement' ? attachment.data : undefined
    };

    setFeedItems([newItem, ...feedItems]);
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
            <CreatePostBox onPost={handleNewPost} />

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                Tất cả
              </button>
              <button 
                onClick={() => setFilter('achievements')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'achievements' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                <Zap className="w-3 h-3 inline mr-1" />
                Thành tựu
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
              <AnimatePresence>
                {feedItems
                  .filter(item => {
                    if (filter === 'all') return true;
                    if (filter === 'achievements') return item.type === 'achievement' || item.type === 'streak_milestone' || item.type === 'level_up';
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
                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200" />
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
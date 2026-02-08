import React from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, TrendingUp, Star, Trophy, UserPlus } from 'lucide-react';
import { useDailyActivityStats, useGamificationStats } from '../hooks/useGamification';
import XPProgressBar from '../components/gamification/XPProgressBar';
import StreakCard from '../components/gamification/StreakCard';
import { useGetUser } from '../hooks/useAuthApi';
import { useCheckFollow, useFollowUser, useUnfollowUser } from '../hooks/useCommunity';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading: isUserLoading } = useGetUser(id || '');
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();
  const targetUserId = user?.id ?? id ?? '';
  const { data: checkFollow, isLoading: checkFollowLoading } = useCheckFollow(targetUserId);  
  const { data: gamificationStats, isLoading: statsLoading } = useGamificationStats(id);
  const { data: dailyActivity, isLoading: dailyLoading } = useDailyActivityStats(id);

  const isLoading = isUserLoading || statsLoading || dailyLoading;

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Words Learned',
      value: gamificationStats?.totalWordsLearned ?? 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Current Streak',
      value: `${gamificationStats?.streak ?? 0} days`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Level',
      value: gamificationStats?.level ?? 0,
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'XP Points',
      value: gamificationStats?.xp ?? 0,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with avatar + nút Theo dõi */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 bg-blue-50 flex items-center justify-center">
              <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
            <p className="text-gray-600">Personal learning profile</p>
          </div>
        </div>
        {targetUserId && checkFollow?.type !== 'ME' && checkFollow?.type === 'UNFOLLOW' ? (
          <button
            type="button"
            onClick={() => followMutation.mutate(targetUserId)}
            disabled={followMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />
            {followMutation.isPending ? 'Đang xử lý...' : 'Theo dõi'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => unfollowMutation.mutate(targetUserId)}
            disabled={unfollowMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />
            {unfollowMutation.isPending ? 'Đang xử lý...' : 'Hủy theo dõi'}

          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gamification Section (no XP events / quick actions here) */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* XP Progress Bar */}
        {gamificationStats && (
          <XPProgressBar
            currentXP={gamificationStats.xp}
            level={gamificationStats.level}
            xpForNextLevel={gamificationStats.xpForNextLevel}
            xpProgress={gamificationStats.xpProgress}
            isMaxLevel={gamificationStats.isMaxLevel}
          />
        )}

        {/* Streak Card */}
        {dailyActivity && gamificationStats && (
          <StreakCard
            streak={gamificationStats.streak}
            dailyGoal={gamificationStats.dailyGoal}
            wordsLearned={dailyActivity.wordsLearned}
            wordsReviewed={dailyActivity.wordsReviewed}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;


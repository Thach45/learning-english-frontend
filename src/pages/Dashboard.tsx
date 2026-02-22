import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Star, Trophy, Clock, Settings } from 'lucide-react';
import { useMe } from '../hooks/useUser';
import { useGamificationStats, useDailyActivityStats, useXPEvents } from '../hooks/useGamification';
import XPProgressBar from '../components/gamification/XPProgressBar';
import StreakCard from '../components/gamification/StreakCard';
import XPEventsList from '../components/gamification/XPEventsList';

const Dashboard: React.FC = () => {
    const { data: profile, isLoading: profileLoading } = useMe();
    const navigate = useNavigate();

    const userId = profile?.id;
    const { data: gamificationStats, isLoading: statsLoading } = useGamificationStats(userId);
    const { data: dailyActivity, isLoading: dailyLoading } = useDailyActivityStats(userId);
    const { data: xpEvents, isLoading: xpLoading } = useXPEvents(userId, 10);
    const isLoading = statsLoading || dailyLoading || xpLoading;

    if (profileLoading || !profile) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">Đang tải...</p>
            </div>
        );
    }

    const stats = [
        {
            label: 'Words Learned',
            value: gamificationStats?.totalWordsLearned ?? profile.totalWordsLearned,
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            label: 'Current Streak',
            value: `${gamificationStats?.streak ?? profile.streak} days`,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            label: 'Level',
            value: gamificationStats?.level ?? profile.level,
            icon: Star,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            label: 'XP Points',
            value: gamificationStats?.xp ?? profile.xp,
            icon: Trophy,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8 flex items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 bg-blue-50 flex items-center justify-center">
                       
                            <img
                                src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                        
                    </div>
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        {profile.name}! 👋
                    </h1>
                    <p className="text-gray-600">
                        {profile.bio || 'Ready to expand your vocabulary today?'}
                    </p>
                </div>
                <Link
                    to="/settings"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition"
                >
                    <Settings className="h-4 w-4" />
                    Cài đặt
                </Link>
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
            
            {/* Gamification Section */}
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

            {/* XP Events */}
            <div className="mb-8">
                <XPEventsList events={xpEvents?.events || []} isLoading={isLoading} />
            </div>
            
            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/learn')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <BookOpen className="h-5 w-5 mr-2" />
                            Continue Learning
                        </button>
                        <button
                            onClick={() => navigate('/learn')} // This could navigate to a specific review page
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <Clock className="h-5 w-5 mr-2" />
                            Review Words
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total XP Earned</span>
                            <span className="font-semibold text-gray-900">
                                {gamificationStats?.xp ?? profile.xp} XP
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Current Level</span>
                            <span className="font-semibold text-gray-900">
                                Level {gamificationStats?.level ?? profile.level}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Learning Streak</span>
                            <span className="font-semibold text-gray-900">
                                {gamificationStats?.streak ?? profile.streak} days
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Words</span>
                            <span className="font-semibold text-gray-900">
                                {gamificationStats?.totalWordsLearned ?? profile.totalWordsLearned}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
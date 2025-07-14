import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { BookOpen, TrendingUp, Star, Trophy, Target, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { user, accessToken, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (accessToken && !user) {
                try {
                    const response = await fetch('/api/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    if (response.ok) {
                        const { data } = await response.json();
                        // The login function in context updates the user and stores it
                        login(accessToken, data as User);
                    } else {
                        console.error('Failed to fetch user data');
                        // Optional: handle logout if token is invalid
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUser();
    }, [accessToken, user, login]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading user information...</p>
            </div>
        );
    }

    const stats = [
        {
            label: 'Words Learned',
            value: user.totalWordsLearned,
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            label: 'Current Streak',
            value: `${user.streak} days`,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            label: 'Level',
            value: user.level,
            icon: Star,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            label: 'XP Points',
            value: user.xp,
            icon: Trophy,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {user.name}! 👋
                </h1>
                <p className="text-gray-600">Ready to expand your vocabulary today?</p>
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
            
            {/* Today's Goal - using dailyGoal from user */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
                <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold">Today's Goal</h3>
                    <p className="text-blue-100">Learn {user.dailyGoal} new words</p>
                </div>
                <Target className="h-8 w-8 text-blue-200" />
                </div>
                {/* Progress bar can be implemented later when we track daily progress */}
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Streak</h3>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="text-3xl">🔥</div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{user.streak} days</p>
                            <p className="text-sm text-gray-600">Keep it up!</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {[...Array(7)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${i < (user.streak % 7) // Simple visualization for the week
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                D{i + 1}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
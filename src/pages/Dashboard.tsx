import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Calendar, Target, Users, BookOpen, Trophy, Clock, Star } from 'lucide-react';
import { mockUser, mockCategories } from '../data/mockData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = mockUser;
  const categories = mockCategories;

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

  const todayGoal = 20; // words per day
  const todayProgress = 12;
  const progressPercentage = (todayProgress / todayGoal) * 100;

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

      {/* Today's Goal */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Today's Goal</h3>
            <p className="text-blue-100">Learn {todayGoal} new words</p>
          </div>
          <Target className="h-8 w-8 text-blue-200" />
        </div>
        
        <div className="w-full bg-blue-400 rounded-full h-3 mb-2">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-blue-100">
          {todayProgress} / {todayGoal} words completed ({Math.round(progressPercentage)}%)
        </p>
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
              onClick={() => navigate('/learn')}
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
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                  i < user.streak
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`/learn?category=${category.id}`)}
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center group"
            >
              <div className={`w-12 h-12 ${category.color} rounded-lg mx-auto mb-3 flex items-center justify-center text-white`}>
                <span className="text-lg">📚</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{category.name}</h4>
              <p className="text-xs text-gray-600">{category.vocabularyCount} words</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
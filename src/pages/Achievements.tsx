import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Award, 
  Star, 
  Target, 
  Users, 
  Book, 
  Calendar, 
  Zap, 
  ArrowLeft, 
  Crown,
  TrendingUp,
  Heart,
  Lightbulb,
  CheckCircle,
  Clock
} from 'lucide-react';

// Mock data
const mockUser = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
  level: 12,
  xp: 2450,
  streak: 7,
  totalWordsLearned: 234,
  achievements: [],
  createdAt: new Date()
};

const mockAchievements = [
  {
    id: 'first-word',
    title: 'First Steps',
    description: 'Learn your first vocabulary word',
    icon: '🎯',
    progress: 1,
    maxProgress: 1,
    unlockedAt: new Date('2024-01-15'),
    category: 'learning',
    rarity: 'common'
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    progress: 7,
    maxProgress: 7,
    unlockedAt: new Date('2024-01-20'),
    category: 'consistency',
    rarity: 'rare'
  },
  {
    id: 'hundred-words',
    title: 'Century Club',
    description: 'Learn 100 vocabulary words',
    icon: '💯',
    progress: 100,
    maxProgress: 100,
    unlockedAt: new Date('2024-02-01'),
    category: 'learning',
    rarity: 'epic'
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Complete 50 quizzes with 90% accuracy',
    icon: '🏆',
    progress: 35,
    maxProgress: 50,
    category: 'excellence',
    rarity: 'legendary'
  },
  {
    id: 'social-learner',
    title: 'Social Butterfly',
    description: 'Share vocabulary with 10 friends',
    icon: '👥',
    progress: 3,
    maxProgress: 10,
    category: 'social',
    rarity: 'rare'
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Get 100% on 5 consecutive quizzes',
    icon: '⭐',
    progress: 2,
    maxProgress: 5,
    category: 'excellence',
    rarity: 'epic'
  },
  {
    id: 'month-streak',
    title: 'Monthly Master',
    description: 'Maintain a 30-day learning streak',
    icon: '📅',
    progress: 7,
    maxProgress: 30,
    category: 'consistency',
    rarity: 'legendary'
  },
  {
    id: 'vocabulary-builder',
    title: 'Vocabulary Builder',
    description: 'Create 5 study sets',
    icon: '📚',
    progress: 2,
    maxProgress: 5,
    category: 'learning',
    rarity: 'common'
  }
];

const Achievements: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const user = mockUser;
  const achievements = mockAchievements;

  const completedAchievements = achievements.filter(a => a.unlockedAt);
  const inProgressAchievements = achievements.filter(a => !a.unlockedAt);

  const levelInfo = {
    current: user.level,
    xp: user.xp,
    nextLevelXp: (user.level + 1) * 200,
    progress: (user.xp % 200) / 200 * 100
  };

  const stats = [
    { 
      label: 'Total XP', 
      value: user.xp.toLocaleString(), 
      icon: Star, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    { 
      label: 'Level', 
      value: user.level, 
      icon: Trophy, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      label: 'Achievements', 
      value: completedAchievements.length, 
      icon: Award, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    { 
      label: 'Streak', 
      value: `${user.streak} days`, 
      icon: Zap, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: Award, color: 'text-gray-600' },
    { id: 'learning', name: 'Learning', icon: Book, color: 'text-blue-600' },
    { id: 'consistency', name: 'Consistency', icon: Calendar, color: 'text-green-600' },
    { id: 'excellence', name: 'Excellence', icon: Star, color: 'text-yellow-600' },
    { id: 'social', name: 'Social', icon: Users, color: 'text-purple-600' }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'common': return { text: 'Common', color: 'bg-gray-100 text-gray-700' };
      case 'rare': return { text: 'Rare', color: 'bg-blue-100 text-blue-700' };
      case 'epic': return { text: 'Epic', color: 'bg-purple-100 text-purple-700' };
      case 'legendary': return { text: 'Legendary', color: 'bg-yellow-100 text-yellow-700' };
      default: return { text: 'Common', color: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Achievements</h1>
            <p className="text-gray-600">Track your learning progress and milestones</p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.bgColor} rounded-2xl shadow-sm border ${stat.borderColor} p-6 hover:shadow-md transition-all duration-300`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
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

        {/* Level Progress */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-6">
            {/* XP Section */}
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <Star className="h-8 w-8 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-1">Level {levelInfo.current}</h3>
                  <p className="text-blue-100 text-lg">
                    {user.xp.toLocaleString()} / {levelInfo.nextLevelXp.toLocaleString()} XP
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-blue-400/30 rounded-full h-4 mb-2">
                <div 
                  className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full h-4 transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${levelInfo.progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-blue-100">
                {Math.round(levelInfo.progress)}% to Level {levelInfo.current + 1}
              </div>
            </div>

            {/* Level Badge */}
            <div className="flex-shrink-0 ml-8">
              <div className="relative">
                {/* Outer Ring */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-1 shadow-lg">
                  {/* Inner Ring */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-2">
                    {/* Badge Content */}
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 flex items-center justify-center relative">
                      {/* Crown Icon */}
                      <div className="text-4xl mb-1">👑</div>
                      
                      {/* Level Number */}
                      <div className="absolute bottom-2 right-2">
                        <div className="bg-white/90 rounded-full w-8 h-8 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">{levelInfo.current}</span>
                        </div>
                      </div>
                      
                      {/* Decorative Elements */}
                      <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full"></div>
                      <div className="absolute top-1 right-1 w-2 h-2 bg-white/60 rounded-full"></div>
                      <div className="absolute bottom-1 left-1 w-2 h-2 bg-white/60 rounded-full"></div>
                      <div className="absolute bottom-1 right-1 w-2 h-2 bg-white/60 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Stars */}
                <div className="absolute -top-2 -left-2 text-yellow-300 text-lg animate-pulse">⭐</div>
                <div className="absolute -top-2 -right-2 text-yellow-300 text-lg animate-pulse">⭐</div>
                <div className="absolute -bottom-2 -left-2 text-yellow-300 text-lg animate-pulse">⭐</div>
                <div className="absolute -bottom-2 -right-2 text-yellow-300 text-lg animate-pulse">⭐</div>
              </div>
              
              {/* Level Title */}
              <div className="text-center mt-4">
                <div className="text-sm text-blue-100 font-medium">MASTER</div>
                <div className="text-xs text-blue-200">Level {levelInfo.current}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAchievements.map((achievement) => {
            const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
            const isCompleted = !!achievement.unlockedAt;
            const rarityBadge = getRarityBadge(achievement.rarity);
            
            return (
              <div 
                key={achievement.id} 
                className={`relative group rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  isCompleted 
                    ? 'border-green-300 bg-white' 
                    : 'border-gray-200 bg-white'
                } ${getRarityColor(achievement.rarity)}`}
              >
                {/* Rarity Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${rarityBadge.color}`}>
                  {rarityBadge.text}
                </div>

                <div className="p-6 text-center">
                  <div className={`text-5xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
                    isCompleted ? '' : 'opacity-50'
                  }`}>
                    {achievement.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {achievement.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {achievement.description}
                  </p>
                  
                  {isCompleted ? (
                    <div className="bg-green-100 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-center text-green-800 font-medium text-sm mb-1">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </div>
                      <div className="text-green-600 text-xs">
                        {achievement.unlockedAt?.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">
                          {achievement.progress} / {achievement.maxProgress}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-blue-600 font-medium text-sm">
                        {Math.round(progressPercentage)}% Complete
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Summary */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Trophy className="h-6 w-6 mr-3 text-yellow-600" />
            Achievement Summary
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold text-gray-900 mb-1">Total Achievements</h4>
              <p className="text-2xl font-bold text-blue-600">{achievements.length}</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="text-3xl mb-2">✅</div>
              <h4 className="font-bold text-gray-900 mb-1">Completed</h4>
              <p className="text-2xl font-bold text-green-600">{completedAchievements.length}</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
              <div className="text-3xl mb-2">⏳</div>
              <h4 className="font-bold text-gray-900 mb-1">In Progress</h4>
              <p className="text-2xl font-bold text-yellow-600">{inProgressAchievements.length}</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-bold text-gray-900 mb-1">Completion Rate</h4>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round((completedAchievements.length / achievements.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
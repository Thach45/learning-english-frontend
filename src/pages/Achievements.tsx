import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Award, Star, Target, Users, Book, Calendar, Zap, ArrowLeft } from 'lucide-react';
import { mockAchievements, mockUser } from '../data/mockData';

const Achievements: React.FC = () => {
  const navigate = useNavigate();
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
    { label: 'Total XP', value: user.xp, icon: Star, color: 'text-yellow-600' },
    { label: 'Level', value: user.level, icon: Trophy, color: 'text-blue-600' },
    { label: 'Achievements', value: completedAchievements.length, icon: Award, color: 'text-purple-600' },
    { label: 'Streak', value: `${user.streak} days`, icon: Zap, color: 'text-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          <div></div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gray-100">
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
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Level {levelInfo.current}</h3>
              <p className="text-blue-100">
                {user.xp} / {levelInfo.nextLevelXp} XP to next level
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">🏆</div>
            </div>
          </div>
          
          <div className="w-full bg-blue-400 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-300"
              style={{ width: `${levelInfo.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Completed Achievements */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
            Completed Achievements ({completedAchievements.length})
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedAchievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {achievement.description}
                  </p>
                  
                  <div className="bg-green-100 rounded-lg p-3">
                    <div className="text-green-800 font-medium text-sm">
                      ✅ Completed
                    </div>
                    <div className="text-green-600 text-xs mt-1">
                      {achievement.unlockedAt?.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-blue-600" />
            In Progress ({inProgressAchievements.length})
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressAchievements.map((achievement) => {
              const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
              
              return (
                <div key={achievement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-3 opacity-50">{achievement.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {achievement.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">
                          {achievement.progress} / {achievement.maxProgress}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-blue-600 font-medium text-sm">
                        {Math.round(progressPercentage)}% Complete
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievement Categories */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Categories</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <Book className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Learning</h4>
              <p className="text-sm text-gray-600">Word mastery achievements</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-green-50">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Consistency</h4>
              <p className="text-sm text-gray-600">Daily streak rewards</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-purple-50">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Social</h4>
              <p className="text-sm text-gray-600">Community participation</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-yellow-50">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Excellence</h4>
              <p className="text-sm text-gray-600">High performance rewards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Trophy } from 'lucide-react';
import { UserAchievement } from '../../types/achievement';
import { achievementApi } from '../../utils/achievement';

// Custom SVG Icons
const CustomIcons = {
  firstSteps: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M12 16L16 12L20 16L16 20L12 16Z" fill="currentColor"/>
      <circle cx="16" cy="16" r="4" fill="currentColor"/>
    </svg>
  ),
  weekWarrior: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 20C8 16.6863 10.6863 14 14 14H18C21.3137 14 24 16.6863 24 20V24H8V20Z" fill="currentColor"/>
      <path d="M16 8C18.2091 8 20 9.79086 20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8Z" fill="currentColor"/>
      <path d="M6 28H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  centuryClub: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="16" height="16" rx="2" fill="currentColor"/>
      <text x="16" y="22" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">100</text>
      <circle cx="16" cy="16" r="12" stroke="white" strokeWidth="1" fill="none"/>
    </svg>
  ),
  vocabularyBuilder: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 8H24V24H8V8Z" fill="currentColor"/>
      <path d="M12 12H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 16H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 20H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 8L16 4L24 8" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  perfectScore: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="16,4 20,12 28,12 22,18 24,26 16,22 8,26 10,18 4,12 12,12" fill="currentColor"/>
      <circle cx="16" cy="16" r="8" stroke="white" strokeWidth="1" fill="none"/>
    </svg>
  ),
  monthlyMaster: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="20" height="18" rx="2" fill="currentColor"/>
      <rect x="8" y="4" width="16" height="6" rx="1" fill="currentColor"/>
      <circle cx="12" cy="7" r="1" fill="white"/>
      <circle cx="20" cy="7" r="1" fill="white"/>
      <text x="16" y="22" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">30</text>
    </svg>
  )
};

const InProgressAchievements: React.FC = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInProgressAchievements();
  }, []);

  const fetchInProgressAchievements = async () => {
    try {
      const data = await achievementApi.getUserInProgressAchievements();
      setAchievements(data);
    } catch (error) {
      console.error('Error fetching in-progress achievements:', error);

    } finally {
      setLoading(false);
    }
  };

  const getRarityBadge = (rarity: string) => {
    const badges = {
      COMMON: { text: 'Phổ biến', color: 'bg-gray-100 text-gray-700' },
      RARE: { text: 'Hiếm', color: 'bg-blue-100 text-blue-700' },
      EPIC: { text: 'Sử thi', color: 'bg-purple-100 text-purple-700' },
      LEGENDARY: { text: 'Huyền thoại', color: 'bg-yellow-100 text-yellow-700' }
    };
    return badges[rarity as keyof typeof badges] || badges.COMMON;
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Thành tích đang thực hiện
        </h3>
        <p className="text-gray-600 text-center py-8">
          Chưa có thành tích nào đang thực hiện
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Target className="h-5 w-5 mr-2 text-blue-600" />
        Thành tích đang thực hiện
      </h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((userAchievement) => {
          const { achievement, progress } = userAchievement;
          const progressPercentage = Math.min((progress / achievement.targetValue) * 100, 100);
          const rarityBadge = getRarityBadge(achievement.rarity);
          const progressColor = getProgressColor(progress, achievement.targetValue);
          
          return (
            <div key={userAchievement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="text-blue-600 transition-colors duration-300">
                  {achievement.icon ? (
                    <img src={achievement.icon} alt={achievement.title} className="w-8 h-8" />
                  ) : (
                    <Trophy className="w-8 h-8" />
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${rarityBadge.color}`}>
                  {rarityBadge.text}
                </span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{achievement.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiến độ</span>
                  <span className="font-medium text-gray-900">
                    {progress} / {achievement.targetValue}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${progressColor} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="text-blue-600 text-xs font-medium text-center">
                  {Math.round(progressPercentage)}% Hoàn thành
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Achievements Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/achievements')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Xem tất cả thành tích
        </button>
      </div>
    </div>
  );
};

export default InProgressAchievements;
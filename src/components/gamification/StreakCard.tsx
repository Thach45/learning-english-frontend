import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Target, Zap } from 'lucide-react';
import { fetchDailyActivityStats } from '../../services/gamificationService';

interface StreakCardProps {
  streak: number;
  dailyGoal: number;
  wordsLearned: number;
  wordsReviewed: number;
}

const StreakCard: React.FC<StreakCardProps> = ({
  streak,
  dailyGoal,
  wordsLearned,
  wordsReviewed,
}) => {
  const [weeklyActivity, setWeeklyActivity] = useState<boolean[]>([]);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);

  const totalActivity = wordsLearned;
  const goalProgress = Math.min(100, (totalActivity / dailyGoal) * 100);
  const isGoalCompleted = totalActivity >= dailyGoal;

  // Helper function to format date for API
  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Fetch weekly activity data
  useEffect(() => {
    const fetchWeeklyActivity = async () => {
      try {
        setIsLoadingCalendar(true);
        const activities = [];
        
        // Get the start of the current week (Monday)
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday = 0
        
        // Fetch 7 days starting from Monday of current week
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - daysFromMonday + i);
          
          try {
            const response = await fetchDailyActivityStats(undefined, formatDateForAPI(date));
            const hasActivity = response.wordsLearned > 0 || response.wordsReviewed >= 10;
            activities.push(hasActivity);
          } catch (error) {
            console.error(`Error fetching activity for day ${i}:`, error);
            activities.push(false); // Default to false on error
          }
        }
        
        setWeeklyActivity(activities);
      } catch (error) {
        console.error('Error fetching weekly activity:', error);
        setWeeklyActivity(Array(7).fill(false));
      } finally {
        setIsLoadingCalendar(false);
      }
    };

    fetchWeeklyActivity();
  }, []);

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-red-500 to-orange-500';
    if (streak >= 15) return 'from-orange-500 to-yellow-500';
    if (streak >= 7) return 'from-yellow-500 to-green-500';
    return 'from-green-500 to-blue-500';
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return '🔥 Legendary Streak!';
    if (streak >= 15) return '🔥 Amazing Streak!';
    if (streak >= 7) return '🔥 Great Streak!';
    if (streak >= 3) return '🔥 Good Streak!';
    return '🔥 Keep it up!';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      {/* Streak Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            className={`p-3 rounded-xl bg-gradient-to-r ${getStreakColor(streak)}`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{streak} Days</h3>
            <p className="text-sm text-gray-600">{getStreakMessage(streak)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Current Streak</p>
          <p className="text-2xl font-bold text-gray-900">{streak}</p>
        </div>
      </div>

      {/* Daily Goal Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Daily Goal</span>
          </div>
          <span className="text-sm text-gray-600">
            {totalActivity}/{dailyGoal} words
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              isGoalCompleted 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${goalProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        {isGoalCompleted && (
          <motion.div
            className="mt-2 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-sm font-medium text-green-600">
              🎉 Daily goal completed!
            </span>
          </motion.div>
        )}
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{wordsLearned}</p>
          <p className="text-xs text-blue-600">Words Learned</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{wordsReviewed}</p>
          <p className="text-xs text-purple-600">Words Reviewed</p>
        </div>
      </div>

      {/* Streak Calendar Preview */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">This Week</span>
          </div>
          {isLoadingCalendar && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          )}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {isLoadingCalendar ? (
            // Loading skeleton
            Array.from({ length: 7 }, (_, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))
          ) : (
            // Actual calendar
            Array.from({ length: 7 }, (_, i) => {
              const hasActivity = weeklyActivity[i] || false;
              
              // Calculate which day of the week this represents
              const today = new Date();
              const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
              const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday = 0
              const isToday = i === daysFromMonday; // Current day in the week
              
              const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              const dayNumber = i + 2; // Thứ 2 = 2, Thứ 3 = 3, ..., Chủ nhật = 8
              
              return (
                <motion.div
                  key={i}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer relative ${
                    hasActivity
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-600'
                  } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    ...(hasActivity && {
                      boxShadow: [
                        "0 0 0 rgba(251, 146, 60, 0.4)",
                        "0 0 20px rgba(251, 146, 60, 0.8)",
                        "0 0 0 rgba(251, 146, 60, 0.4)"
                      ]
                    })
                  }}
                  transition={{ 
                    duration: 0.2, 
                    delay: i * 0.1,
                    ...(hasActivity && {
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    })
                  }}
                  title={`${dayNames[i]} (Thứ ${dayNumber}): ${hasActivity ? 'Active' : 'No activity'}`}
                >
                  {dayNumber}
                  
                  {/* Fire effect for active days */}
                  {hasActivity && (
                    <>
                      {/* Fire glow effect */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="w-6 h-6 bg-gradient-to-t from-orange-400 to-yellow-400 rounded-full blur-sm" />
                      </motion.div>
                      
                      {/* Fire particles */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{
                          y: [0, -6, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: 0.3,
                          ease: "easeOut"
                        }}
                      >
                        <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full blur-sm" />
                      </motion.div>
                      
                      {/* Sparkle effects */}
                      <motion.div
                        className="absolute -top-0.5 -right-0.5"
                        animate={{
                          scale: [0, 1, 0],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: 0.8,
                          ease: "easeInOut"
                        }}
                      >
                        <Zap className="w-2 h-2 text-yellow-300" />
                      </motion.div>
                      
                      <motion.div
                        className="absolute -bottom-0.5 -left-0.5"
                        animate={{
                          scale: [0, 1, 0],
                          rotate: [360, 180, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: 1.2,
                          ease: "easeInOut"
                        }}
                      >
                        <Zap className="w-1.5 h-1.5 text-orange-300" />
                      </motion.div>
                    </>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
        {!isLoadingCalendar && (
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              {weeklyActivity.filter(Boolean).length}/7 days active this week
            </p>
          </div>
        )}
      </div>

      {/* Motivation Message */}
      {streak === 0 && (
        <motion.div
          className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-700">
            Start your learning streak today! 🔥
          </p>
        </motion.div>
      )}

      {streak > 0 && (
        <motion.div
          className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-700">
            Don't break your streak! Study today to keep it going! 🔥
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default StreakCard; 
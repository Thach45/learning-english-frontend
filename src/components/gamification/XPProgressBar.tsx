import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';

interface XPProgressBarProps {
  currentXP: number;
  level: number;
  xpForNextLevel: number;
  xpProgress: number;
  isMaxLevel: boolean;
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXP,
  level,
  xpForNextLevel,
  xpProgress,
  isMaxLevel,
}) => {
  const getLevelColor = (level: number) => {
    const colors = [
      'from-gray-400 to-gray-500',
      'from-green-400 to-green-500',
      'from-blue-400 to-blue-500',
      'from-purple-400 to-purple-500',
      'from-yellow-400 to-yellow-500',
      'from-red-400 to-red-500',
      'from-indigo-400 to-indigo-500',
      'from-pink-400 to-pink-500',
      'from-violet-400 to-violet-500',
      'from-amber-400 to-amber-500',
    ];
    return colors[Math.min(level - 1, colors.length - 1)];
  };

  const getLevelIcon = (level: number) => {
    if (level >= 8) return <Trophy className="w-4 h-4" />;
    if (level >= 5) return <Star className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${getLevelColor(level)}`}>
            {getLevelIcon(level)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Level {level}</h3>
            <p className="text-sm text-gray-600">{currentXP} XP</p>
          </div>
        </div>
        {!isMaxLevel && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Next Level</p>
            <p className="text-lg font-bold text-gray-900">{xpForNextLevel} XP</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{xpProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getLevelColor(level)} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* XP Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{currentXP}</p>
          <p className="text-xs text-gray-600">Total XP</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">
            {isMaxLevel ? 'MAX' : xpForNextLevel - currentXP}
          </p>
          <p className="text-xs text-gray-600">
            {isMaxLevel ? 'Level' : 'XP to Next'}
          </p>
        </div>
      </div>

      {/* Level Up Animation */}
      {xpProgress === 100 && !isMaxLevel && (
        <motion.div
          className="mt-4 p-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg text-white text-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Star className="w-6 h-6 mx-auto mb-2" />
          <p className="font-bold">Level Up!</p>
          <p className="text-sm">Congratulations!</p>
        </motion.div>
      )}
    </div>
  );
};

export default XPProgressBar; 
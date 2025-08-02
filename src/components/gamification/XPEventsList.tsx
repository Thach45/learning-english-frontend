import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Star, Trophy, Target, Clock } from 'lucide-react';
import { XPEvent, EVENT_TYPE_LABELS } from '../../utils/gamification';

interface XPEventsListProps {
  events: XPEvent[];
  isLoading?: boolean;
}

const XPEventsList: React.FC<XPEventsListProps> = ({ events = [], isLoading = false }) => {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'new_word_learned':
        return <BookOpen className="w-4 h-4 text-green-600" />;
      case 'word_reviewed':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'mastered_word':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'streak_bonus':
        return <Trophy className="w-4 h-4 text-orange-600" />;
      case 'daily_goal_completed':
        return <Target className="w-4 h-4 text-purple-600" />;
      default:
        return <Zap className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'new_word_learned':
        return 'bg-green-50 border-green-200';
      case 'word_reviewed':
        return 'bg-blue-50 border-blue-200';
      case 'mastered_word':
        return 'bg-yellow-50 border-yellow-200';
      case 'streak_bonus':
        return 'bg-orange-50 border-orange-200';
      case 'daily_goal_completed':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays}d ago`;
  };

  const getEventDescription = (event: XPEvent) => {
    const baseDescription = EVENT_TYPE_LABELS[event.eventType as keyof typeof EVENT_TYPE_LABELS] || event.eventType;
    
    if (event.metadata?.word) {
      return `${baseDescription}: "${event.metadata.word}"`;
    }
    
    if (event.metadata?.streak) {
      return `${baseDescription}: ${event.metadata.streak} day streak!`;
    }
    
    return baseDescription;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent XP Events</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg animate-pulse"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="w-12 h-4 bg-gray-200 rounded" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Recent XP Events</h3>
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-gray-600">XP History</span>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No XP events yet</p>
          <p className="text-sm text-gray-400">Start learning to earn XP!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${getEventColor(event.eventType)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-2 rounded-lg bg-white shadow-sm">
                {getEventIcon(event.eventType)}
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {getEventDescription(event)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTime(event.createdAt)}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">
                  +{event.xpAmount} XP
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {events.length > 0 && (
        <motion.div
          className="mt-4 pt-4 border-t border-gray-200 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-500">
            Keep learning to earn more XP! 🚀
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default XPEventsList; 
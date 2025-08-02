import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Star, Trophy } from 'lucide-react';

interface XPNotificationProps {
  xpGained: number;
  eventType: string;
  word?: string;
  onComplete?: () => void;
}

const XPNotification: React.FC<XPNotificationProps> = ({
  xpGained,
  eventType,
  word,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'new_word_learned':
        return <Star className="w-5 h-5 text-green-600" />;
      case 'word_reviewed':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 'mastered_word':
        return <Trophy className="w-5 h-5 text-yellow-600" />;
      default:
        return <Zap className="w-5 h-5 text-purple-600" />;
    }
  };

  const getEventMessage = (eventType: string, word?: string) => {
    switch (eventType) {
      case 'new_word_learned':
        return word ? `Learned "${word}"!` : 'New word learned!';
      case 'word_reviewed':
        return word ? `Reviewed "${word}"!` : 'Word reviewed!';
      case 'mastered_word':
        return word ? `Mastered "${word}"!` : 'Word mastered!';
      default:
        return 'XP gained!';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm"
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              className="p-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              {getEventIcon(eventType)}
            </motion.div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {getEventMessage(eventType, word)}
              </p>
              <motion.p
                className="text-lg font-bold text-green-600"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                +{xpGained} XP
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default XPNotification; 
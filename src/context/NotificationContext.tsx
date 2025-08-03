import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X,
  Bell,
  Star,
  Zap,
  Trophy
} from 'lucide-react';

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'xp';

// Notification interface
export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  autoClose?: boolean;
}

// Notification context
interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

// Notification Provider
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (notification: Omit<NotificationItem, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);

    // Auto close if enabled
    if (notification.autoClose !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

// Individual notification component
const NotificationItem: React.FC<{ notification: NotificationItem; onRemove: (id: string) => void }> = ({ 
  notification, 
  onRemove 
}) => {
  const getIcon = () => {
    if (notification.icon) return notification.icon;
    
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'achievement':
        return <Trophy className="w-5 h-5" />;
      case 'xp':
        return <Zap className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: 'text-green-500',
          close: 'text-green-400 hover:text-green-600'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: 'text-red-500',
          close: 'text-red-400 hover:text-red-600'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-500',
          close: 'text-yellow-400 hover:text-yellow-600'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-500',
          close: 'text-blue-400 hover:text-blue-600'
        };
      case 'achievement':
        return {
          bg: 'bg-purple-50 border-purple-200',
          text: 'text-purple-800',
          icon: 'text-purple-500',
          close: 'text-purple-400 hover:text-purple-600'
        };
      case 'xp':
        return {
          bg: 'bg-orange-50 border-orange-200',
          text: 'text-orange-800',
          icon: 'text-orange-500',
          close: 'text-orange-400 hover:text-orange-600'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-500',
          close: 'text-gray-400 hover:text-gray-600'
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative p-4 border rounded-lg shadow-lg max-w-sm w-full ${colors.bg}`}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${colors.icon}`}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${colors.text}`}>
            {notification.title}
          </h4>
          <p className={`text-sm mt-1 ${colors.text} opacity-90`}>
            {notification.message}
          </p>
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className={`mt-2 text-xs font-medium ${colors.text} hover:opacity-80 transition-opacity`}
            >
              {notification.action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={() => onRemove(notification.id)}
          className={`flex-shrink-0 ${colors.close} transition-colors`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Notification container
const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Quick notification helpers
export const showSuccess = (title: string, message: string, duration?: number) => {
  // This will be used with useNotification hook
  return { type: 'success' as const, title, message, duration };
};

export const showError = (title: string, message: string, duration?: number) => {
  return { type: 'error' as const, title, message, duration };
};

export const showWarning = (title: string, message: string, duration?: number) => {
  return { type: 'warning' as const, title, message, duration };
};

export const showInfo = (title: string, message: string, duration?: number) => {
  return { type: 'info' as const, title, message, duration };
};

export const showAchievement = (title: string, message: string, duration?: number) => {
  return { type: 'achievement' as const, title, message, duration };
};

export const showXP = (title: string, message: string, duration?: number) => {
  return { type: 'xp' as const, title, message, duration };
};

export default NotificationProvider; 
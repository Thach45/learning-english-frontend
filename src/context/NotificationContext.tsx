import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Trophy,
  Zap,
  Sparkles,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'xp';

export interface NotificationItemType {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
  autoClose?: boolean;
}

interface NotificationContextType {
  notifications: NotificationItemType[];
  addNotification: (notification: Omit<NotificationItemType, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItemType[]>([]);

  const addNotification = (notification: Omit<NotificationItemType, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    const duration = notification.duration ?? 4000;
    const item = { ...notification, id, duration };

    setNotifications((prev) => {
      const next = [...prev, item];
      return next.length > 4 ? next.slice(-4) : next;
    });

    if (notification.autoClose !== false) {
      setTimeout(() => removeNotification(id), duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = React.useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

// ─── Style config ────────────────────────────────────────────────────
const STYLE_MAP: Record<
  NotificationType,
  { icon: React.ReactNode; accent: string; bg: string; ring: string; progress: string }
> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    accent: 'text-emerald-600',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-100',
    progress: 'bg-emerald-500',
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-rose-600" />,
    accent: 'text-rose-600',
    bg: 'bg-rose-50',
    ring: 'ring-rose-100',
    progress: 'bg-rose-500',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    accent: 'text-amber-600',
    bg: 'bg-amber-50',
    ring: 'ring-amber-100',
    progress: 'bg-amber-500',
  },
  info: {
    icon: <Info className="w-5 h-5 text-indigo-600" />,
    accent: 'text-indigo-600',
    bg: 'bg-indigo-50',
    ring: 'ring-indigo-100',
    progress: 'bg-indigo-500',
  },
  achievement: {
    icon: <Trophy className="w-5 h-5 text-purple-600" />,
    accent: 'text-purple-600',
    bg: 'bg-purple-50',
    ring: 'ring-purple-200',
    progress: 'bg-gradient-to-r from-purple-500 to-indigo-500',
  },
  xp: {
    icon: <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />,
    accent: 'text-amber-600',
    bg: 'bg-amber-50',
    ring: 'ring-amber-200',
    progress: 'bg-gradient-to-r from-amber-400 to-orange-500',
  },
};

// ─── Notification Card ───────────────────────────────────────────────
const NotificationCard: React.FC<{
  notification: NotificationItemType;
  onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
  const s = STYLE_MAP[notification.type] ?? STYLE_MAP.info;
  const isSpecial = notification.type === 'achievement' || notification.type === 'xp';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`
        relative w-full overflow-hidden rounded-2xl bg-white pointer-events-auto
        border border-gray-100 shadow-lg
        ${isSpecial ? `ring-1 ${s.ring}` : ''}
      `}
    >
      {/* Decorative glow cho achievement / xp */}
      {isSpecial && (
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-[0.07] blur-2xl bg-gradient-to-br from-purple-500 to-indigo-500 pointer-events-none" />
      )}

      <div className="flex items-start gap-3 p-3.5">
        {/* Icon */}
        {/* <div className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl ${s.bg}`}>
          {notification.icon ?? s.icon}
        </div> */}

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-gray-900 truncate leading-5">
              {notification.title}
            </h4>
            {notification.type === 'achievement' && (
              <Sparkles className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-gray-500 leading-relaxed line-clamp-2">
            {notification.message}
          </p>

          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {notification.action.label} &rarr;
            </button>
          )}
        </div>

        {/* Close */}
        <button
          onClick={() => onRemove(notification.id)}
          className="flex-shrink-0 p-1 -mt-0.5 -mr-1 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress bar */}
      {notification.autoClose !== false && (
        <div className="h-[3px] w-full bg-gray-50">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: (notification.duration ?? 4000) / 1000, ease: 'linear' }}
            className={`h-full rounded-full ${s.progress}`}
          />
        </div>
      )}
    </motion.div>
  );
};

// ─── Container ───────────────────────────────────────────────────────
const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-0 right-0 z-[9999] p-4 sm:p-5 flex flex-col gap-2.5 w-full max-w-[380px] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} onRemove={removeNotification} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────
export const showSuccess = (title: string, message: string, duration?: number) =>
  ({ type: 'success' as const, title, message, duration });
export const showError = (title: string, message: string, duration?: number) =>
  ({ type: 'error' as const, title, message, duration });
export const showWarning = (title: string, message: string, duration?: number) =>
  ({ type: 'warning' as const, title, message, duration });
export const showInfo = (title: string, message: string, duration?: number) =>
  ({ type: 'info' as const, title, message, duration });
export const showAchievement = (title: string, message: string, duration?: number) =>
  ({ type: 'achievement' as const, title, message, duration });
export const showXP = (title: string, message: string, duration?: number) =>
  ({ type: 'xp' as const, title, message, duration });

export default NotificationProvider;

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { gamificationApi, GamificationStats, DailyActivity, XPEventsResponse } from '../utils/gamification';

interface GamificationContextType {
  stats: GamificationStats | null;
  dailyActivity: DailyActivity | null;
  xpEvents: XPEventsResponse | null;
  isLoading: boolean;
  refreshStats: () => Promise<void>;
  refreshDailyActivity: () => Promise<void>;
  refreshXPEvents: () => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity | null>(null);
  const [xpEvents, setXPEvents] = useState<XPEventsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshStats = async () => {
    if (!user) return;
    
    try {
      const data = await gamificationApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

  const refreshDailyActivity = async () => {
    if (!user) return;
    
    try {
      const data = await gamificationApi.getDailyActivity();
      setDailyActivity(data);
    } catch (error) {
      console.error('Error refreshing daily activity:', error);
    }
  };

  const refreshXPEvents = async () => {
    if (!user) return;
    
    try {
      const data = await gamificationApi.getXPEvents(10);
      setXPEvents(data);
    } catch (error) {
      console.error('Error refreshing XP events:', error);
      // Set empty events on error
      setXPEvents({ events: [], total: 0 });
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const [statsData, activityData, eventsData] = await Promise.allSettled([
          gamificationApi.getStats(),
          gamificationApi.getDailyActivity(),
          gamificationApi.getXPEvents(10)
        ]);
        
        if (statsData.status === 'fulfilled') {
          setStats(statsData.value);
        }
        if (activityData.status === 'fulfilled') {
          setDailyActivity(activityData.value);
        }
        if (eventsData.status === 'fulfilled') {
          setXPEvents(eventsData.value);
        } else {
          // Set empty events on error
          setXPEvents({ events: [], total: 0 });
        }
      } catch (error) {
        console.error('Error fetching initial gamification data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [user]);

  const value: GamificationContextType = {
    stats,
    dailyActivity,
    xpEvents,
    isLoading,
    refreshStats,
    refreshDailyActivity,
    refreshXPEvents,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}; 
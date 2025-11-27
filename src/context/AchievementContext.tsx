import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAchievement } from '../types';
import { achievementService } from '../service/achievement';

interface AchievementContextType {
  achievements: UserAchievement[];
  inProgressAchievements: UserAchievement[];
  isLoading: boolean;
  error: string | null;
  refreshAchievements: () => Promise<void>;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const useAchievement = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievement must be used within an AchievementProvider');
  }
  return context;
};

interface AchievementProviderProps {
  children: ReactNode;
}

export const AchievementProvider: React.FC<AchievementProviderProps> = ({ children }) => {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [inProgressAchievements, setInProgressAchievements] = useState<UserAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    try {
      const [allAchievements, inProgress] = await Promise.all([
        achievementService.getUserAchievements(),
        achievementService.getInProgressAchievements()
      ]);
      setAchievements(allAchievements);
      setInProgressAchievements(inProgress);
      setError(null);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError('Failed to load achievements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const refreshAchievements = async () => {
    setIsLoading(true);
    await fetchAchievements();
  };

  const value = {
    achievements,
    inProgressAchievements,
    isLoading,
    error,
    refreshAchievements
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
};
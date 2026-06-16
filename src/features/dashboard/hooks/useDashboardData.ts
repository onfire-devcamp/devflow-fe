import { useState, useEffect } from 'react';
import {
  fetchUserProgress,
  fetchAllProjects,
  fetchUserStreak,
} from '../api/dashboardApi';
import type {
  ApiProject,
  ContinueLearning,
  StreakData,
} from '../types/dashboardTypes';

interface UseDashboardDataReturn {
  continueData: ContinueLearning | null;
  projects: ApiProject[];
  streakData: StreakData | null;
  isLoadingProgress: boolean;
  isLoadingProjects: boolean;
  isLoadingStreak: boolean;
  error: string | null;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [continueData, setContinueData] = useState<ContinueLearning | null>(
    null,
  );
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingStreak, setIsLoadingStreak] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoadingProgress(true);
        const data = await fetchUserProgress();
        setContinueData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load progress:', err);
        setError('Failed to load your progress. Please try again.');
        setContinueData(null);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
  }, []);

  // Fetch projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const data = await fetchAllProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setError('Failed to load projects. Please try again.');
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  //fetch streakdata
  useEffect(() => {
    const loadStreak = async () => {
      try {
        setIsLoadingStreak(true);
        const data = await fetchUserStreak();
        setStreakData(data);
      } catch (err) {
        console.error('Failed to load streak:', err);
        setStreakData(null);
      } finally {
        setIsLoadingStreak(false);
      }
    };

    loadStreak();
  }, []);

  return {
    continueData,
    projects,
    streakData,
    isLoadingProgress,
    isLoadingProjects,
    isLoadingStreak,
    error,
  };
}

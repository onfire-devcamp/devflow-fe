import { axiosClient } from '../../../lib/axiosClient';
import type {
  ApiProject,
  ContinueLearning,
  StreakData,
} from '../types/dashboardTypes';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const fetchUserProgress = async (): Promise<ContinueLearning> => {
  try {
    const response = await axiosClient.get<ContinueLearning, ContinueLearning>(
      '/user/progress',
    );
    return response;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

export const fetchAllProjects = async (): Promise<ApiProject[]> => {
  try {
    const response = await axiosClient.get<
      ApiResponse<ApiProject[]>,
      ApiResponse<ApiProject[]>
    >('/project/');
    if (response.success) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const fetchUserStreak = async (): Promise<StreakData> => {
  try {
    const response = await axiosClient.get<StreakData, StreakData>(
      '/user/streak',
    );
    return response;
  } catch (error) {
    console.error('Error fetching user streak:', error);
    throw error;
  }
};

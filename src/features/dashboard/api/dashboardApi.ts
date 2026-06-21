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
    const response = await axiosClient.get<
      ApiResponse<ContinueLearning>,
      ApiResponse<ContinueLearning>
    >('/user/progress');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch streak');
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

export const fetchAllProjects = async (): Promise<ApiProject[]> => {
  try {
    const response = await axiosClient.get<
      ApiResponse<ApiProject[]> | ApiProject[],
      ApiResponse<ApiProject[]> | ApiProject[]
    >('/project/');

    if (
      response &&
      !Array.isArray(response) &&
      'success' in response &&
      response.success &&
      'data' in response
    ) {
      return (response as ApiResponse<ApiProject[]>).data;
    } else if (Array.isArray(response)) {
      return response as ApiProject[];
    }

    throw new Error(
      (response as { message?: string })?.message || 'Failed to fetch projects',
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const fetchUserStreak = async (): Promise<StreakData> => {
  try {
    const response = await axiosClient.get<
      ApiResponse<StreakData>,
      ApiResponse<StreakData>
    >('/user/streak');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch streak');
  } catch (error) {
    console.error('Error fetching user streak:', error);
    throw error;
  }
};

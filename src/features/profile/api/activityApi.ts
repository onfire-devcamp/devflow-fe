import type { ActivityResponse } from '../types/activityTypes';
import { axiosClient } from '../../../lib/axiosClient';

export const fetchUserActivities = async (
  userId: string,
  limit?: number,
): Promise<ActivityResponse[]> => {
  const response = await axiosClient.get(`/activity/user/${userId}`, {
    params: limit ? { limit } : undefined,
  });

  return response.data as ActivityResponse[];
};

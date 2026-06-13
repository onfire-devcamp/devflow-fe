import type { ActivityResponse } from '../types/activityTypes';
import { axiosClient } from '../../../lib/axiosClient';

export const fetchUserActivities = async (
  userId: string,
  limit?: number,
): Promise<ActivityResponse[]> => {
  return await axiosClient.get<ActivityResponse[], ActivityResponse[]>(
    `/activity/user/${userId}`,
    {
      params: limit ? { limit } : undefined,
    },
  );
};

import type { ActivityResponse } from '../types/activityTypes';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const buildUserActivityUrl = (userId: string, limit?: number) => {
  const url = new URL(`/api/activity/user/${userId}`, API_BASE_URL);
  if (limit !== undefined) {
    url.searchParams.set('limit', String(limit));
  }
  return url.toString();
};

export const fetchUserActivities = async (
  userId: string,
  limit?: number,
): Promise<ActivityResponse[]> => {
  const response = await fetch(buildUserActivityUrl(userId, limit));
  if (!response.ok) {
    throw new Error(`Failed to fetch activities: ${response.status}`);
  }
  return (await response.json()) as ActivityResponse[];
};

import { useEffect, useState } from 'react';
import { fetchUserActivities } from '../api/activityApi';
import type { ActivityResponse } from '../types/activityTypes';

type ActivityItem = {
  id: string;
  category: string;
  title: string;
};

type ActivityLogProps = {
  userId?: string;
  limit?: number;
};

const mapActivitiesToItems = (activities: ActivityResponse[]): ActivityItem[] =>
  activities.map((activity) => ({
    id: `${activity.projectId}-${activity.createdAt}`,
    category: activity.moduleName,
    title: activity.activityTitle,
  }));

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'setup-vite',
    category: 'Setup & Foundations',
    title: 'Initialize the Vite project',
  },
  {
    id: 'add-tailwind',
    category: 'Setup & Foundations',
    title: 'Add Tailwind CSS',
  },
];

export default function ActivityLog({ userId, limit = 10 }: ActivityLogProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITY);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isActive = true;

    const loadActivities = async () => {
      if (!userId) {
        if (isActive) {
          setActivities(MOCK_ACTIVITY);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetchUserActivities(userId, limit);
        const mapped = mapActivitiesToItems(response);
        if (isActive) {
          setActivities(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        if (isActive) {
          setActivities(MOCK_ACTIVITY);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadActivities();

    return () => {
      isActive = false;
    };
  }, [userId, limit]);

  return (
    <section className="border border-[var(--color-primary-mid)] rounded-[24px] p-5 md:p-8 shadow-sm bg-white w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Recent activity
          </h3>
          <p className="text-sm text-gray-400">
            Latest progress across your projects.
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold px-3 py-1.5 md:px-4 md:py-2 border border-[var(--color-primary-mid)] text-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-soft)] transition-colors whitespace-nowrap"
        >
          Open project
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-sm text-gray-400">Loading activity...</div>
      ) : (
        <ul className="space-y-6">
          {activities.map((item, index) => (
            <li key={item.id} className="relative pl-7">
              <span
                className="absolute left-[6px] top-1.5 h-full w-px bg-[var(--color-primary-mid)]"
                aria-hidden="true"
              />
              {index === activities.length - 1 ? (
                <span
                  className="absolute left-[6px] top-4 h-[calc(100%-16px)] w-px bg-white"
                  aria-hidden="true"
                />
              ) : null}
              <span
                className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-[var(--color-success)] flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
                {item.category}
              </p>
              <p className="text-sm font-medium text-gray-700">{item.title}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

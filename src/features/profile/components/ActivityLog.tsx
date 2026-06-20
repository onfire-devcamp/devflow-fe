import { useEffect, useState } from 'react';
import { fetchUserActivities } from '../api/activityApi';
import type { ActivityResponse } from '../types/activityTypes';
import { useNavigate } from 'react-router-dom';

type ActivityItem = {
  id: string;
  category: string;
  title: string;
  slug?: string;
};

type ActivityLogProps = {
  userId?: string;
  limit?: number;
};

const mapActivitiesToItems = (activities: ActivityResponse[]): ActivityItem[] =>
  activities.map((activity, index) => {
    const project =
      typeof activity.projectId === 'object' ? activity.projectId : null;
    return {
      id:
        activity._id ??
        `${typeof activity.projectId === 'string' ? activity.projectId : project?._id}-${activity.createdAt}-${index}`,
      category: project?.title || activity.moduleName,
      title: activity.activityTitle,
      slug: project?.slug,
    };
  });

export default function ActivityLog({ userId, limit = 10 }: ActivityLogProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    const loadActivities = async () => {
      if (!userId) {
        if (isActive) {
          setActivities([]);
          setError('Sign in to see your recent activity.');
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchUserActivities(userId, limit);
        const mapped = mapActivitiesToItems(response);
        if (isActive) {
          setActivities(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        if (isActive) {
          setActivities([]);
          setError('Unable to load activity right now.');
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
          onClick={() => {
            const lastActive = activities.find((a) => a.slug);
            if (lastActive?.slug) {
              navigate(`/workspace/${lastActive.slug}`);
            }
          }}
          disabled={!activities.some((a) => a.slug)}
          className="text-xs font-semibold px-3 py-1.5 md:px-4 md:py-2 border border-[var(--color-primary-mid)] text-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-soft)] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Open current project
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-sm text-gray-400">Loading activity...</div>
      ) : error ? (
        <div className="py-8 text-sm text-red-500" role="alert">
          {error}
        </div>
      ) : activities.length === 0 ? (
        <div className="py-8 text-sm text-gray-400">
          No recent activity yet.
        </div>
      ) : (
        <div className="relative pl-2">
          {/* Timeline connecting line */}
          <div
            className="absolute left-[11.5px] top-3 bottom-3 w-[2px] bg-slate-200"
            aria-hidden="true"
          />

          <ul className="space-y-6">
            {activities.map((item) => (
              <li key={item.id} className="relative pl-8">
                {/* Timeline dot */}
                <span
                  className="absolute left-1 top-1.5 h-4 w-4 rounded-full border-[3px] border-white bg-[var(--color-success)] flex items-center justify-center shadow-sm"
                  aria-hidden="true"
                />
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
                  {item.category}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {item.title}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

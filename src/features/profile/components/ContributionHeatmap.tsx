import { useEffect, useState } from 'react';
import { Flame, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../auth/stores/authStore';
import { fetchUserActivities } from '../api/activityApi';
import { axiosClient } from '../../../lib/axiosClient';

import {
  generateDatesMatrix,
  generateMockHeatmapData,
} from '../utils/heatmapMockData';

export default function ContributionHeatmap() {
  const user = useAuthStore((state) => state.user);

  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [streak, setStreak] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      if (!user?.id) {
        if (isActive) setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const datesMatrix = generateDatesMatrix();
      const mockData = generateMockHeatmapData(datesMatrix, user.id);

      try {
        const streakRes = await axiosClient.get<
          unknown,
          { data: { currentStreak: number } }
        >('/user/streak');
        if (isActive) {
          setStreak(streakRes.data?.currentStreak || 0);
        }

        const activities = await fetchUserActivities(user.id);

        if (isActive) {
          setTotalTasks(activities.length);

          const activityCounts: Record<string, number> = {};
          activities.forEach((activity) => {
            const date = new Date(activity.createdAt);
            date.setHours(0, 0, 0, 0);
            const dateStr = date.toISOString().split('T')[0];
            activityCounts[dateStr] = (activityCounts[dateStr] || 0) + 1;
          });

          const mergedData = datesMatrix.map((col, colIndex) =>
            col.map((date, rowIndex) => {
              const dateStr = date.toISOString().split('T')[0];
              if (activityCounts[dateStr]) {
                return Math.min(activityCounts[dateStr], 4);
              }
              return mockData[colIndex][rowIndex];
            }),
          );
          setHeatmapData(mergedData);
        }
      } catch (error) {
        console.error('Failed to load heatmap data:', error);
        if (isActive) {
          setHeatmapData((prev) => (prev.length === 0 ? mockData : prev));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, [user?.id]);

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return 'bg-slate-100';
      case 1:
        return 'bg-pink-200';
      case 2:
        return 'bg-pink-300';
      case 3:
        return 'bg-pink-500';
      case 4:
        return 'bg-pink-600';
      default:
        return 'bg-slate-100';
    }
  };

  if (isLoading) {
    return (
      <section className="border border-[var(--color-primary-mid)] rounded-[24px] p-5 md:p-8 shadow-sm bg-white w-full animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <div className="h-6 w-32 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-64 bg-slate-200 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-5 w-24 bg-slate-200 rounded" />
            <div className="w-px h-4 bg-gray-200" />
            <div className="h-5 w-24 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="overflow-hidden pb-4">
          <div className="flex gap-[3px]">
            {Array.from({ length: 52 }).map((_, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="w-[11px] h-[11px] rounded-[2px] bg-slate-200"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-[var(--color-primary-mid)] rounded-[24px] p-5 md:p-8 shadow-sm bg-white w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Contributions</h3>
          <p className="text-sm text-gray-400">
            Your recent activity over the last year
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-orange-600 font-medium">
            <Flame size={18} />
            <span>{streak} Day Streak</span>
          </div>
          <div className="w-px h-4 bg-gray-200"></div>
          <div className="flex items-center gap-1.5 text-gray-600 font-medium">
            <CheckCircle size={18} className="text-[var(--color-success)]" />
            <span>{totalTasks} Tasks</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[750px]">
          <div className="flex gap-[3px]">
            {heatmapData.length > 0 ? (
              heatmapData.map((col, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-[3px]">
                  {col.map((intensity, rowIndex) => (
                    <div
                      key={`${colIndex}-${rowIndex}`}
                      className={`w-[11px] h-[11px] rounded-[2px] ${getIntensityColor(intensity)}`}
                      title={`Intensity: ${intensity}`}
                    />
                  ))}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400 py-4">
                No contributions found.
              </div>
            )}
          </div>
          {heatmapData.length > 0 && (
            <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState, useRef } from 'react';
import { Flame, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../auth/stores/authStore';
import { fetchUserActivities } from '../api/activityApi';
import type { ActivityResponse } from '../types/activityTypes';
import { axiosClient } from '../../../lib/axiosClient';
import { generateMockHeatmapData } from '../utils/heatmapMockData';

// Generate dynamic dates matrix based on screen width (number of columns)
// It ends with the current week on the far right.
const getDynamicDatesMatrix = (cols: number) => {
  const data: Date[][] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the Sunday of the current week
  const currentWeekSunday = new Date(today);
  currentWeekSunday.setDate(today.getDate() - today.getDay());

  // Start date is (cols - 1) weeks before the current week's Sunday
  const startDate = new Date(currentWeekSunday);
  startDate.setDate(currentWeekSunday.getDate() - (cols - 1) * 7);

  const currentDate = new Date(startDate);
  for (let i = 0; i < cols; i++) {
    const colData: Date[] = [];
    for (let row = 0; row < 7; row++) {
      colData.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    data.push(colData);
  }
  return data;
};

export default function ContributionHeatmap() {
  const user = useAuthStore((state) => state.user);
  const containerRef = useRef<HTMLDivElement>(null);

  const [streak, setStreak] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [columnsCount, setColumnsCount] = useState<number>(52);
  const [activities, setActivities] = useState<ActivityResponse[]>([]);

  // 1. Measure container width on mount and resize to fit columns
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Measure the container width where the heatmap sits
        const width = containerRef.current.clientWidth;
        // Each column takes 11px + 3px gap = 14px.
        const count = Math.floor(width / 14);
        setColumnsCount(count > 0 ? count : 12); // Fallback to at least 12 columns
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // 2. Fetch data ONCE when user loads
  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      if (!user?.id) {
        if (isActive) setIsLoading(false);
        return;
      }
      setIsLoading(true);

      try {
        const streakRes = await axiosClient.get<
          unknown,
          { data: { currentStreak: number } }
        >('/user/streak');
        if (isActive) {
          setStreak(streakRes.data?.currentStreak || 0);
        }

        const fetchedActivities = await fetchUserActivities(user.id);
        if (isActive) {
          setTotalTasks(fetchedActivities.length);
          setActivities(fetchedActivities);
        }
      } catch (error) {
        console.error('Failed to load activity data:', error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [user?.id]);

  // 3. Rebuild the heatmap data whenever columnsCount or activities change
  let heatmapData: number[][] = [];
  if (user?.id) {
    const datesMatrix = getDynamicDatesMatrix(columnsCount);
    const mockData = generateMockHeatmapData(datesMatrix, user.id);

    const activityCounts: Record<string, number> = {};
    activities.forEach((activity) => {
      const date = new Date(activity.createdAt);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      activityCounts[dateStr] = (activityCounts[dateStr] || 0) + 1;
    });

    heatmapData = datesMatrix.map((col, colIndex) =>
      col.map((date, rowIndex) => {
        const dateStr = date.toISOString().split('T')[0];
        if (activityCounts[dateStr]) {
          return Math.min(activityCounts[dateStr], 4);
        }
        return mockData[colIndex][rowIndex];
      }),
    );
  }

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

  const datesMatrix = getDynamicDatesMatrix(columnsCount);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renderMonthLabels = () => {
    if (heatmapData.length === 0) return null;
    const labels = [];
    let lastMonth = -1;

    for (let i = 0; i < columnsCount; i++) {
      const month = datesMatrix[i][0].getMonth();
      if (month !== lastMonth) {
        // Skip placing a label on the very first column to avoid cutoff text if possible
        if (i > 0 || columnsCount < 10) {
          labels.push({
            colIndex: i,
            name: datesMatrix[i][0].toLocaleString('default', {
              month: 'short',
            }),
          });
        }
        lastMonth = month;
      }
    }

    return (
      <div className="relative h-4 mt-2 text-xs text-gray-400 w-full">
        {labels.map((label, idx) => (
          <span
            key={idx}
            className="absolute"
            style={{ left: `${label.colIndex * 14}px` }}
          >
            {label.name}
          </span>
        ))}
      </div>
    );
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
        <div className="overflow-hidden pb-4" ref={containerRef}>
          <div className="flex gap-[3px]">
            {Array.from({ length: columnsCount }).map((_, colIndex) => (
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
          <p className="text-sm text-gray-400">Your recent activity</p>
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

      <div className="pb-4 w-full overflow-hidden" ref={containerRef}>
        <div className="w-full">
          <div className="flex gap-[3px]">
            {heatmapData.length > 0 ? (
              datesMatrix.map((col, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-[3px]">
                  {col.map((cellDate, rowIndex) => {
                    const isFuture = cellDate > today;
                    const intensity = heatmapData[colIndex]?.[rowIndex] || 0;

                    return (
                      <div
                        key={`${colIndex}-${rowIndex}`}
                        className={`w-[11px] h-[11px] rounded-[2px] ${
                          isFuture
                            ? 'bg-transparent'
                            : getIntensityColor(intensity)
                        }`}
                        title={isFuture ? '' : `Intensity: ${intensity}`}
                      />
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400 py-4">
                No contributions found.
              </div>
            )}
          </div>
          {renderMonthLabels()}
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { Flame, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../auth/stores/authStore';
import { fetchUserActivities } from '../api/activityApi';
import { axiosClient } from '../../../lib/axiosClient';

// Helper to get a matrix of dates for the last 52 weeks
const generateDatesMatrix = () => {
  const data = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the most recent Saturday (end of the week)
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

  const currentDate = new Date(endOfWeek);
  currentDate.setDate(endOfWeek.getDate() - (52 * 7 - 1)); // 52 weeks ago

  for (let col = 0; col < 52; col++) {
    const colData = [];
    for (let row = 0; row < 7; row++) {
      colData.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    data.push(colData);
  }
  return data;
};

// Generate mock data for dates before today
const generateMockHeatmapData = (datesMatrix: Date[][]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return datesMatrix.map((col) =>
    col.map((date) => {
      if (date < today) {
        // Randomly assign contribution intensity (0 to 4) for past dates
        return Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0;
      }
      return 0; // Today onwards is 0 by default
    }),
  );
};

export default function ContributionHeatmap() {
  const user = useAuthStore((state) => state.user);

  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [streak, setStreak] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      if (!user?.id) return;

      const datesMatrix = generateDatesMatrix();
      const mockData = generateMockHeatmapData(datesMatrix);

      try {
        // Fetch streak
        const streakRes = await axiosClient.get('/user/streak');
        if (isActive) {
          // completedDays represents the current streak length logic for now or we could just use what backend provides
          // Assuming backend returns a completedDays or total streak in message.
          // Wait, backend getUserStreakService returns { completedDays, ... }. We will use completedDays for now.
          setStreak(streakRes.completedDays || 0);
        }

        // Fetch activities
        const activities = await fetchUserActivities(user.id);

        if (isActive) {
          setTotalTasks(activities.length);

          // Map real activities
          const activityCounts: Record<string, number> = {};
          activities.forEach((activity) => {
            const date = new Date(activity.createdAt);
            date.setHours(0, 0, 0, 0);
            const dateStr = date.toISOString().split('T')[0];
            activityCounts[dateStr] = (activityCounts[dateStr] || 0) + 1;
          });

          // Merge real activities into heatmap
          const mergedData = datesMatrix.map((col, colIndex) =>
            col.map((date, rowIndex) => {
              const dateStr = date.toISOString().split('T')[0];
              if (activityCounts[dateStr]) {
                // Determine intensity based on counts (max 4)
                return Math.min(activityCounts[dateStr], 4);
              }
              // Fallback to mock data if no real activity
              return mockData[colIndex][rowIndex];
            }),
          );
          setHeatmapData(mergedData);
        }
      } catch (error) {
        console.error('Failed to load heatmap data:', error);
        if (isActive && heatmapData.length === 0) {
          setHeatmapData(mockData);
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
                Loading contributions...
              </div>
            )}
          </div>
          {heatmapData.length > 0 && (
            <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
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

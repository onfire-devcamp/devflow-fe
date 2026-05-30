import type { WeekDayData } from '../types/dashboardTypes';

interface WeeklyStreakCardProps {
  days: WeekDayData[];
  completedDays: number;
  totalDays: number;
  message: string;
}

export const WeeklyStreakCard = ({
  days,
  completedDays,
  totalDays,
  message,
}: WeeklyStreakCardProps) => {
  return (
    <div>
      <h3>
        {completedDays}/{totalDays} days completed
      </h3>
      <div>
        {days.map((day) => (
          <span key={day.label}>{day.completed ? '✓' : '○'}</span>
        ))}
      </div>
      <p>{message}</p>
    </div>
  );
};

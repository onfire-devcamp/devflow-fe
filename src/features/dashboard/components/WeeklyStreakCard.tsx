import type { WeekDayData } from '../types/dashboardTypes';

interface WeeklyStreakCardProps {
  days: WeekDayData[];
  completedDays: number;
  totalDays: number;
  message: string;
}

export function WeeklyStreakCard({
  days,
  completedDays,
  totalDays,
  message,
}: WeeklyStreakCardProps) {
  return (
    <div className="h-full bg-white border border-primary-mid/80 rounded-2xl p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-fg">This week</h3>
        <span className="text-sm text-fg-muted">
          {completedDays} of {totalDays} days
        </span>
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div
              className={`w-full h-8 rounded-lg ${
                day.completed
                  ? 'bg-primary'
                  : 'bg-gray-100 border border-gray-200'
              }`}
            />
            <span className="text-[11px] font-medium text-fg-muted">
              {day.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-auto text-xs text-fg-muted text-center leading-relaxed">
        {message}
      </p>
    </div>
  );
}

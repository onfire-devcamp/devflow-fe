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
    <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-fg">This week</h3>
        <span className="text-sm text-fg-muted">
          {completedDays} of {totalDays} days
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-1.5">
            <div
              className={`w-full aspect-square rounded-xl transition-colors ${
                day.completed
                  ? 'bg-primary'
                  : 'bg-slate-100 border border-slate-200'
              }`}
              aria-label={`${day.label}: ${day.completed ? 'completed' : 'not completed'}`}
            />
            <span className="text-xs text-fg-muted">{day.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-fg-muted leading-relaxed">{message}</p>
    </div>
  );
}

import { Button } from './Button';

interface ReadOnlyBannerProps {
  message: string;
  onBackToTask: () => void;
}

export function ReadOnlyBanner({ message, onBackToTask }: ReadOnlyBannerProps) {
  return (
    <div className="flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-t-xl shadow-sm text-sm">
      <span>
        <strong className="font-semibold">Read-only file.</strong> {message}
      </span>
      <Button
        variant="ghost"
        className="text-amber-700 hover:bg-amber-100 px-3 py-1.5 h-auto text-xs font-semibold rounded-lg"
        onClick={onBackToTask}
      >
        ← Back to Task
      </Button>
    </div>
  );
}

import { User } from 'lucide-react';
import { Button } from './Button';

export const GuestBadge = () => {
  return (
    <Button
      variant="ghost"
      className="space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 uppercase tracking-wide text-xs"
    >
      <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
        <User
          className="w-3 h-3 text-primary"
          fill="currentColor"
          viewBox="0 0 24 24"
        />
      </div>
      <span className="text-sm font-semibold text-primary px-1">Guest</span>
    </Button>
  );
};

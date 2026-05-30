import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ActionBarProps {
  isReadOnly: boolean;
  xpRewards: number;
}

export function ActionBar({ isReadOnly, xpRewards }: ActionBarProps) {
  return (
    <div className="mt-4 flex justify-between items-center shrink-0">
      <div className="text-xs font-bold text-fg-muted bg-primary-soft border border-primary-mid/40 px-3 py-1.5 rounded-xl">
        ✨ Rewards:{' '}
        <span className="text-primary font-black">{xpRewards} XP</span>
      </div>

      {!isReadOnly && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="!w-auto !py-2 px-4 text-xs font-bold shadow-xs"
          >
            Reset to skeleton
          </Button>

          <Button
            variant="primary"
            className="!w-auto !py-2 px-4 text-xs font-bold flex items-center space-x-1.5"
          >
            <span>Submit Code</span>
            <Send className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

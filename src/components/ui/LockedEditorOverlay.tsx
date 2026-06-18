import { Lock } from 'lucide-react';
import { Button } from './Button';

interface LockedEditorOverlayProps {
  onBackToTask?: () => void;
  message?: string;
}

export function LockedEditorOverlay({
  onBackToTask,
  message = 'Complete previous tasks to unlock this file',
}: LockedEditorOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
      <div className="bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl p-6 flex flex-col items-center max-w-sm text-center transform transition-all">
        <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mb-4 border border-slate-600">
          <Lock className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-2">File Locked</h3>
        <p className="text-sm text-slate-400 mb-6">{message}</p>
        {onBackToTask && (
          <Button
            onClick={onBackToTask}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
          >
            Back to Current Task
          </Button>
        )}
      </div>
    </div>
  );
}

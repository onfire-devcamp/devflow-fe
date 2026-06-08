import { Star, Send } from 'lucide-react';
import type { TaskDetailsState } from '../../roadmap/RoadmapType';

interface WorkspaceFooterProps {
  taskDetails: TaskDetailsState | null;
  isEvaluating: boolean;
  onResetToSkeleton: () => void;
  onSubmitCode: () => void;
}

export function WorkspaceFooter({
  taskDetails,
  isEvaluating,
  onResetToSkeleton,
  onSubmitCode,
}: WorkspaceFooterProps) {
  if (!taskDetails) return null;

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center gap-1 text-amber-500 font-medium text-xs">
        <Star size={14} className="flex-shrink-0" fill="currentColor" />
        <span>
          Worth{' '}
          <span className="font-bold text-slate-700">
            {taskDetails.skillPoints} XP
          </span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onResetToSkeleton}
          className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition shadow-sm cursor-pointer"
        >
          Reset to skeleton
        </button>
        <button
          onClick={onSubmitCode}
          disabled={isEvaluating}
          className={`px-5 py-2 text-xs font-semibold text-white bg-primary hover:opacity-90 rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer ${
            isEvaluating ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          <span>{isEvaluating ? 'Reviewing...' : 'Submit code'}</span>
          <Send className="w-3.5 h-3.5 transform rotate-90 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}

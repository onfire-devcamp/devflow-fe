import { Star, Send } from 'lucide-react';
import type { TaskDetailsState } from '../../roadmap/RoadmapType';
import { Button } from '../../../components/ui/Button';

interface WorkspaceFooterProps {
  taskDetails: TaskDetailsState | null;
  isEvaluating: boolean;
  isCompleted?: boolean;
  isCodeModified?: boolean;
  onResetToSkeleton: () => void;
  onSubmitCode: () => void;
}

export function WorkspaceFooter({
  taskDetails,
  isEvaluating,
  isCompleted,
  isCodeModified,
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
        <Button
          variant="outline"
          onClick={onResetToSkeleton}
          disabled={isCompleted}
          className="!w-auto px-4 !py-2 text-xs"
        >
          Reset to skeleton
        </Button>
        <Button
          onClick={onSubmitCode}
          disabled={isEvaluating || isCompleted || !isCodeModified}
          className="!w-auto px-5 !py-2 text-xs flex items-center gap-1.5"
        >
          <span>
            {isCompleted
              ? 'Task Completed'
              : isEvaluating
                ? 'Reviewing...'
                : 'Submit code'}
          </span>
          <Send className="w-3.5 h-3.5 transform rotate-90 flex-shrink-0" />
        </Button>
      </div>
    </div>
  );
}

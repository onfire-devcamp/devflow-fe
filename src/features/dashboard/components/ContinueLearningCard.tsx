import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mascot from '../../../assets/mascot.png';
import { Button } from '../../../components/ui/Button';
import type { ContinueLearningCardProps } from '../types/dashboardTypes';

export function ContinueLearningCard({ data }: ContinueLearningCardProps) {
  const navigate = useNavigate();

  const handleResume = () => {
    navigate(`/workspace/${data.slug}`);
  };
  return (
    <div className="h-full bg-primary-soft border border-primary-mid/40 rounded-2xl p-6 flex flex-col justify-between">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-primary-mid/30 overflow-hidden flex items-center justify-center">
          <img src={mascot} alt="" className="w-full h-full object-cover " />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-0.5">
            Continue learning
          </p>
          <h3 className="text-base font-bold text-fg leading-snug mb-0.5">
            {data.title}
          </h3>
          <p className="text-sm text-fg-muted leading-snug">
            You're on{' '}
            <span className="font-semibold text-fg">{data.moduleName}</span>.{' '}
            {data.moduleHint}
          </p>
        </div>

        <div className="flex-shrink-0">
          <Button
            onClick={handleResume}
            variant="primary"
            className="!w-auto !rounded-full !px-5 !py-2.5 gap-1.5 text-sm font-semibold active:scale-95"
          >
            Resume <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="mt-5 h-2 bg-white/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${data.progressPercent}%` }}
        />
      </div>
    </div>
  );
}

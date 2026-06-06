import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PATHS } from '../../../config/paths';
import type { ContinueLearningData } from '../types/dashboardTypes';

interface ContinueLearningCardProps {
  data: ContinueLearningData;
}

export function ContinueLearningCard({ data }: ContinueLearningCardProps) {
  const {
    id,
    title,
    moduleName,
    moduleHint,
    progressPercent,
    thumbnailEmoji = '📦',
  } = data;

  return (
    <div className="border border-primary-mid rounded-2xl p-5 sm:p-6 bg-white shadow-xs">
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-2xl bg-primary-soft shrink-0 flex items-center justify-center select-none">
          <span className="text-3xl" aria-hidden="true">
            {thumbnailEmoji}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">
            Continue Learning
          </p>
          <h2 className="text-base font-bold text-fg leading-snug">{title}</h2>
          <p className="text-sm text-fg-muted mt-0.5">
            You're on{' '}
            <span className="font-semibold text-fg">{moduleName}</span>.{' '}
            {moduleHint}
          </p>
          <div
            className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <Link
          to={PATHS.PROJECT_DETAIL(id)}
          aria-label={`Resume ${title}`}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Resume
          <ArrowRight
            className="w-4 h-4"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { PATHS } from '../../../config/paths';
import type { DashboardProject } from '../types/dashboardTypes';

interface ProjectCardProps {
  project: DashboardProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const {
    id,
    title,
    description,
    category,
    difficulty,
    estimatedHours,
    completedTasks,
    totalTasks,
  } = project;

  const percentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <Link
      to={PATHS.PROJECT_DETAIL(id)}
      className="flex flex-col border border-slate-200 rounded-2xl p-5 bg-white hover:shadow-md hover:border-primary-mid transition-all duration-200 group"
    >
      {/* Meta row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
          {category} · {difficulty}
        </span>
        <span className="text-xs text-fg-muted font-medium">
          {estimatedHours}h
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-fg mb-1.5 group-hover:text-primary transition-colors leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-fg-muted line-clamp-2 mb-5 flex-1">
        {description}
      </p>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-fg-muted">
            {completedTasks}/{totalTasks} tasks
          </span>
          <span className="font-semibold text-fg">{percentage}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${percentage}% complete`}
          />
        </div>
      </div>
    </Link>
  );
}

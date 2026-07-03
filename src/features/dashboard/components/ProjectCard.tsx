import { Link } from 'react-router-dom';
import { PATHS } from '../../../config/paths';
import type { ApiProject } from '../types/dashboardTypes';

interface ProjectCardProps {
  project: ApiProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const displayLevel =
    project.slug === 'twitter-clone'
      ? 'Advanced'
      : project.level || 'Intermediate';
  const levelColorClass =
    displayLevel.toLowerCase() === 'beginner'
      ? 'text-green-600'
      : displayLevel.toLowerCase() === 'advanced'
        ? 'text-red-600'
        : 'text-yellow-600';

  return (
    <div className="flex w-full h-full">
      <Link
        to={PATHS.PROJECT_DETAIL(project.slug)}
        className="bg-white border border-primary-mid/80 shadow-sm rounded-2xl p-5 flex flex-col hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer group w-full"
      >
        {/* Header: category · difficulty + duration */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            {(project.category || 'Fullstack').toUpperCase()} ·{' '}
            <span className={levelColorClass}>
              {displayLevel.toUpperCase()}
            </span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-fg mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        {/* Description*/}
        <p className="flex-1 text-sm text-fg-muted leading-relaxed mb-4">
          {project.description}
        </p>
      </Link>
    </div>
  );
}

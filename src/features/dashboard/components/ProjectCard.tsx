import type { ApiProject } from '../types/dashboardTypes';

interface ProjectCardProps {
  project: ApiProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white border border-primary-mid/80 rounded-2xl p-5 flex flex-col hover:border-primary hover:shadow-sm transition-all duration-200 cursor-pointer group">
      {/* Header: category · difficulty + duration */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {project.category ?? 'FULLSTACK'} · {project.level ?? 'INTERMEDIATE'}
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
    </div>
  );
}

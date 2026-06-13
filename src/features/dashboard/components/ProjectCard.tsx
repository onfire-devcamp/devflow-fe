import type { ApiProject } from '../types/dashboardTypes';

interface ProjectCardProps {
  project: ApiProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const completedTasks = project.completedTasks ?? 0;
  const totalTasks = project.totalTasks ?? 1;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const getDurationText = (hours?: number) => {
    if (!hours) return '0h';
    if (hours >= 60) {
      const h = Math.floor(hours / 60);
      const m = hours % 60;
      return m > 0 ? `${h}h${m}m` : `${h}h`;
    }
    return `${hours}h`;
  };
  return (
    <div className="h-[250px] bg-white border border-primary-mid/80 rounded-2xl p-5 flex flex-col hover:border-primary hover:shadow-sm transition-all duration-200 cursor-pointer group">
      {/* Header: category · difficulty + duration */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {project.category ?? 'FULLSTACK'} · {project.level ?? 'INTERMEDIATE'}
        </span>
        <span className="flex-shrink-0 text-xs text-fg-muted font-medium">
          {getDurationText(project.estimatedHours)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-fg mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
        {project.title}
      </h3>

      {/* Description*/}
      <p className="flex-1 text-sm text-fg-muted leading-relaxed line-clamp-2 mb-4">
        {project.description}
      </p>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-fg-muted mb-1.5">
          <span>
            {completedTasks}/{totalTasks} tasks
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

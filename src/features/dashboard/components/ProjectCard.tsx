import type { DashboardProject } from '../types/dashboardTypes';

interface ProjectCardProps {
  project: DashboardProject;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div>
      <h4>{project.title}</h4>
      <p>{project.description}</p>
      <p>
        {project.completedTasks}/{project.totalTasks} tasks
      </p>
    </div>
  );
};

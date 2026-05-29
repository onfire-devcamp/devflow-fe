export interface Task {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'locked';
}

export interface CategoryGroup {
  category: string;
  tasks: Task[];
}

export interface ProjectData {
  projectName: string;
  progressPercentage: number;
  academyData: CategoryGroup[];
}

export interface ProgressBarProps {
  progress: number;
}
export interface SidebarHeaderProps {
  projectName: string;
}
export interface RoadmapTaskItemButtonProps {
  children: React.ReactNode;
  isSelected: boolean;
  status: 'completed' | 'current' | 'locked';
  onClick: () => void;
}
export interface TaskListProps {
  academyData: CategoryGroup[];
  activeTaskId: string;
  onTaskSelect: (id: string) => void;
}
export interface RoadmapIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
export interface IconProps {
  className?: string;
}
export interface RoadmapTabButtonProps {
  children: React.ReactNode;
  active?: boolean;
}

export type TaskStatus = 'completed' | 'current' | 'locked';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
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
  status: TaskStatus;
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
  onClick?: () => void;
}

export interface RawTaskFromAPI {
  _id?: string;
  id?: string;
  title?: string;
  status?: string;
}

export interface RawModuleFromAPI {
  title?: string;
  tasks?: RawTaskFromAPI[];
}

export interface RawProjectFromAPI {
  title: string;
  description?: string;
  progressPercentage?: number;
  isInitialized?: boolean;
}

export interface APIResponseData {
  project?: RawProjectFromAPI;
  modules?: RawModuleFromAPI[];
}

export interface APIRoadmapResponse {
  success: boolean;
  message?: string;
  data?: APIResponseData;
}

export interface ProjectDetails {
  title: string;
  description?: string;
  progressPercentage?: number;
  isInitialized?: boolean;
}

export interface TaskDetails {
  _id: string;
  title: string;
  description?: string;
}
export interface TaskFile {
  _id: string;
  projectId: string;
  path: string;
  content: string;
  skeleton?: string;
}

export interface TaskFileSolution {
  _id: string;
  taskId: string;
  fileId: TaskFile;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface APITaskDetailsResponse {
  success: boolean;
  data?: {
    _id?: string;
    id?: string;
    title?: string;
    description?: string;
    task?: {
      _id: string;
      moduleId: string;
      title: string;
      description: string;
      instructions?: string;
      skillPoints?: number;
      concepts?: string;
      mcq?: {
        question?: string;
        options?: { id: string; text: string }[];
      };
      skillCategory?: string;
      fileId: TaskFile[];
    };
    solutions?: TaskFileSolution[];
  };
  message?: string;
}

export interface TaskDetailsState {
  _id: string;
  title: string;
  description?: string;
  skillPoints: number;
  mcq?: {
    question?: string;
    options?: { id: string; text: string }[];
  };
  files: TaskFile[];
  solutions?: TaskFileSolution[];
}

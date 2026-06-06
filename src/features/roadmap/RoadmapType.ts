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
// src/features/roadmap/roadmapTypes.ts

// --- Raw API Response Structures from MongoDB ---
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

export interface APITaskDetailsResponse {
  success: boolean;
  data?: {
    _id?: string;
    id?: string;
    title?: string;
    description?: string;
  };
  message?: string;
}

// --- Local UI Component States ---
export interface ProjectDetails {
  title: string;
  description?: string;
  progressPercentage?: number;
}

export interface TaskDetails {
  _id: string;
  title: string;
  description?: string;
}

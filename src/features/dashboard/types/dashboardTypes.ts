export type FilterCategory = 'ALL' | 'FRONTEND' | 'BACKEND' | 'FULLSTACK';

export interface ApiProject {
  _id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  previewUrl: string;
  systemFlowUrl: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  estimatedHours?: number;
  completedTasks?: number;
  totalTasks?: number;
}

export interface ContinueLearning {
  id: string;
  projectId: string;
  slug: string;
  title: string;
  moduleName: string;
  moduleHint: string;
  progressPercent: number;
}

export interface WeekDayData {
  label: string;
  completed: boolean;
}
export interface ContinueLearningCardProps {
  data: ContinueLearning | null;
}
export interface StreakData {
  weekDays: WeekDayData[];
  completedDays: number;
  totalDays: number;
  message: string;
}

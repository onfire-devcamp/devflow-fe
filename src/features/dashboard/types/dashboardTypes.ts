import type {
  DifficultyLevel,
  ProjectCategory,
} from '../../projects/types/projectTypes';

export type FilterCategory = 'ALL' | 'FRONTEND' | 'BACKEND' | 'FULLSTACK';

export interface DashboardProject {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  completedTasks: number;
  totalTasks: number;
}

export interface ContinueLearningData {
  id: string;
  title: string;
  moduleName: string;
  moduleHint: string;
  progressPercent: number;
  thumbnailEmoji?: string;
}

export interface WeekDayData {
  label: string;
  completed: boolean;
}

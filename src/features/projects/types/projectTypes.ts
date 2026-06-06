export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ProjectCategory = 'FULLSTACK' | 'FRONTEND' | 'BACKEND';
export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  moduleCount: number;
  status: ProjectStatus;
  previewUrl?: string;
  features: string[];
  techStack: string[];
  systemFlowUrl?: string;
  codebaseUrl?: string;
}

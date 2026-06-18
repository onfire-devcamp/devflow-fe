import { axiosClient } from '../../../lib/axiosClient';
import type { ProjectDetail, DifficultyLevel } from '../types/projectTypes';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ProjectTechStackItem {
  name: string;
  iconUrl: string;
  category: string;
}

interface ProjectDetailsResponse {
  success: boolean;
  data: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    level: string;
    previewUrl?: string;
    systemFlowUrl?: string;
    techStack: { name: string; iconUrl: string; category: string }[];
    features: { title: string; description: string }[];
  };
}

export const getProjectTechStackGrouped = async (
  projectId: string,
): Promise<Record<string, ProjectTechStackItem[]>> => {
  try {
    const response = await axiosClient.get<
      ApiResponse<Record<string, ProjectTechStackItem[]>>,
      ApiResponse<Record<string, ProjectTechStackItem[]>>
    >(`/project/${projectId}/tech-stack`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch tech stack');
  } catch (error) {
    console.error('Error fetching tech stack:', error);
    throw error;
  }
};

export interface FileTemplateResponse {
  _id: string;
  path: string;
  content?: string;
  readOnly?: boolean;
}

export const getProjectCodebase = async (
  slug: string,
): Promise<FileTemplateResponse[]> => {
  try {
    const response = await axiosClient.get<
      ApiResponse<FileTemplateResponse[]>,
      ApiResponse<FileTemplateResponse[]>
    >(`/project/${slug}/codebase`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch codebase');
  } catch (error) {
    console.error('Error fetching codebase:', error);
    throw error;
  }
};

export const getProjectBySlug = async (
  slug: string,
): Promise<ProjectDetail> => {
  const res = await axiosClient.get<
    ProjectDetailsResponse,
    ProjectDetailsResponse
  >(`/project/${slug}`);
  const data = res.data;

  return {
    id: data._id,
    title: data.title,
    slug: data.slug,
    description: data.description || '',
    category: 'FULLSTACK',
    difficulty: data.level.toUpperCase() as DifficultyLevel,
    estimatedHours: 14,
    moduleCount: 5,
    status: 'NOT_STARTED',
    previewUrl: data.previewUrl || '',
    features: data.features || [],
    techStack: data.techStack || [],
    systemFlowUrl: data.systemFlowUrl || '',
    codebaseUrl: 'https://github.com',
  };
};

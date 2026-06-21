import { axiosClient } from '../../../lib/axiosClient';
import type {
  ProjectDetail,
  DifficultyLevel,
  ProjectCategory,
} from '../types/projectTypes';

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
    category: string;
    previewUrl?: string;
    systemFlowUrl?: string;
    techStack: { name: string; iconUrl: string; category: string }[];
    features: { title: string; description: string }[];
    moduleCount?: number;
    estimatedHours?: number;
  };
}

export const getProjectTechStackGrouped = async (
  projectId: string,
): Promise<Record<string, ProjectTechStackItem[]>> => {
  try {
    const response = await axiosClient.get<
      | ApiResponse<Record<string, ProjectTechStackItem[]>>
      | Record<string, ProjectTechStackItem[]>,
      | ApiResponse<Record<string, ProjectTechStackItem[]>>
      | Record<string, ProjectTechStackItem[]>
    >(`/project/${projectId}/tech-stack`);

    if ('success' in response && response.success && 'data' in response) {
      return (response as ApiResponse<Record<string, ProjectTechStackItem[]>>)
        .data;
    } else if (response && Object.keys(response).length > 0) {
      return response as Record<string, ProjectTechStackItem[]>;
    }
    throw new Error(
      (response as { message?: string })?.message ||
        'Failed to fetch tech stack',
    );
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
      ApiResponse<FileTemplateResponse[]> | FileTemplateResponse[],
      ApiResponse<FileTemplateResponse[]> | FileTemplateResponse[]
    >(`/project/${slug}/codebase`);

    if ('success' in response && response.success && 'data' in response) {
      return (response as ApiResponse<FileTemplateResponse[]>).data;
    } else if (Array.isArray(response)) {
      return response as FileTemplateResponse[];
    }
    throw new Error(
      (response as { message?: string })?.message || 'Failed to fetch codebase',
    );
  } catch (error) {
    console.error('Error fetching codebase:', error);
    throw error;
  }
};

export const getProjectBySlug = async (
  slug: string,
): Promise<ProjectDetail> => {
  const res = await axiosClient.get<
    ProjectDetailsResponse | ProjectDetailsResponse['data'],
    ProjectDetailsResponse | ProjectDetailsResponse['data']
  >(`/project/${slug}`);

  const data =
    'success' in res && res.success && 'data' in res
      ? (res as ProjectDetailsResponse).data
      : (res as ProjectDetailsResponse['data']);

  return {
    id: data._id,
    title: data.title,
    slug: data.slug,
    description: data.description || '',
    category: (data.category?.toUpperCase() || 'FULLSTACK') as ProjectCategory,
    difficulty: data.level.toUpperCase() as DifficultyLevel,
    estimatedHours: data.estimatedHours || 0,
    moduleCount: data.moduleCount || 0,
    status: 'NOT_STARTED',
    previewUrl: data.previewUrl || '',
    features: data.features || [],
    techStack: data.techStack || [],
    systemFlowUrl: data.systemFlowUrl || '',
    codebaseUrl: 'https://github.com',
  };
};

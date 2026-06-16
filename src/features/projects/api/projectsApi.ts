import { axiosClient } from '../../../lib/axiosClient';
import type { ProjectDetail, DifficultyLevel } from '../types/projectTypes';

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
    techStack: { name: string }[];
    features: { title: string; description: string }[];
  };
}

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
    category: 'FULLSTACK', // Fallback for now as backend doesn't store this yet
    difficulty: data.level.toUpperCase() as DifficultyLevel,
    estimatedHours: 14,
    moduleCount: 5,
    status: 'NOT_STARTED',
    previewUrl: data.previewUrl || '',
    features: data.features?.map((f) => f.title) || [],
    techStack: data.techStack?.map((t) => t.name) || [],
    systemFlowUrl: data.systemFlowUrl || '',
    codebaseUrl: 'https://github.com',
  };
};

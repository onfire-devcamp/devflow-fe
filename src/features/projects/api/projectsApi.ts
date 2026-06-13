import { axiosClient } from '../../../lib/axiosClient';
import type { ProjectDetail } from '../types/projectTypes';

export const getProjectById = async (id: string): Promise<ProjectDetail> => {
  return await axiosClient.get<ProjectDetail, ProjectDetail>(`/projects/${id}`);
};

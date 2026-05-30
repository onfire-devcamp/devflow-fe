import { axiosClient } from '../../../lib/axiosClient';
import type { ProjectDetail } from '../types/projectTypes';

export const getProjectById = async (id: string): Promise<ProjectDetail> => {
  const response = await axiosClient.get(`/projects/${id}`);
  return response.data as ProjectDetail;
};

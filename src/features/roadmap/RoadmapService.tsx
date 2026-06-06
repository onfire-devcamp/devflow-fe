import axios from 'axios';
import type {
  APIRoadmapResponse,
  APITaskDetailsResponse,
  CategoryGroup,
  ProjectDetails,
  TaskDetails,
  Task,
  RawModuleFromAPI,
  RawTaskFromAPI,
} from './RoadmapType';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const RoadmapService = {
  /**
   * Fetches and processes project roadmap data directly for UI consumption
   */
  getProjectRoadmap: async (
    projectId: string,
  ): Promise<{ project: ProjectDetails | null; modules: CategoryGroup[] }> => {
    const response = await apiClient.get<APIRoadmapResponse>(
      `/api/project/${projectId}/roadmap`,
    );

    const resJson = response.data;

    if (!resJson || !resJson.success || !resJson.data) {
      throw new Error(resJson?.message || 'Invalid API data structure.');
    }

    const { project, modules } = resJson.data;

    // 1. Map Project Details
    const mappedProject: ProjectDetails | null = project
      ? {
          title: project.title,
          description: project.description,
          progressPercentage: project.progressPercentage,
        }
      : null;

    // 2. Map Roadmap Modules
    const mappedModules: CategoryGroup[] = Array.isArray(modules)
      ? modules.map(
          (module: RawModuleFromAPI): CategoryGroup => ({
            category: (module?.title || '').toUpperCase(),
            tasks: Array.isArray(module?.tasks)
              ? module.tasks.map((task: RawTaskFromAPI): Task => {
                  let assignedStatus: 'completed' | 'current' | 'locked' =
                    'locked';

                  if (
                    task?.status === 'completed' ||
                    task?.status === 'passed'
                  ) {
                    assignedStatus = 'completed';
                  } else if (
                    task?.status === 'current' ||
                    task?.status === 'unlocked'
                  ) {
                    assignedStatus = 'current';
                  }

                  return {
                    id: task?._id || task?.id || '',
                    title: task?.title || '',
                    status: assignedStatus,
                  };
                })
              : [],
          }),
        )
      : [];

    return {
      project: mappedProject,
      modules: mappedModules,
    };
  },

  /**
   * Fetches and flattens specific task configurations for UI views
   */
  getTaskDetails: async (taskId: string): Promise<TaskDetails | null> => {
    const response = await apiClient.get<APITaskDetailsResponse>(
      `/api/task/${taskId}`,
    );

    const resJson = response.data;

    if (!resJson || !resJson.success || !resJson.data) {
      throw new Error(resJson?.message || 'Failed to fetch task details.');
    }

    const data = resJson.data;
    return {
      _id: data._id || data.id || '',
      title: data.title || '',
      description: data.description,
    };
  },
};

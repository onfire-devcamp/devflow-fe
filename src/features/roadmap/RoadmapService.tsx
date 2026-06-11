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

// status function

const mapTaskStatus = (status?: string): 'completed' | 'current' | 'locked' => {
  if (status === 'completed' || status === 'passed') return 'completed';
  if (status === 'current' || status === 'unlocked') return 'current';
  return 'locked';
};

const calculateProgress = (
  modules: CategoryGroup[],
  providedPercentage?: number,
): number => {
  if (providedPercentage !== undefined) return providedPercentage;

  let totalTasks = 0;
  let completedTasks = 0;

  modules.forEach((module) => {
    totalTasks += module.tasks.length;
    completedTasks += module.tasks.filter(
      (task) => task.status === 'completed',
    ).length;
  });

  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
};

const getFirstTaskId = (modules: CategoryGroup[]): string => {
  if (modules.length > 0 && modules[0].tasks.length > 0) {
    return modules[0].tasks[0].id;
  }
  return '';
};

export const RoadmapService = {
  /**
   * Fetches and processes project roadmap data directly for UI consumption
   */
  getProjectRoadmap: async (
    projectId: string,
  ): Promise<{
    project: ProjectDetails | null;
    modules: CategoryGroup[];
    defaultTaskId: string;
    calculatedProgress: number;
  }> => {
    const response = await apiClient.get<APIRoadmapResponse>(
      `/api/project/${projectId}/roadmap`,
    );

    const resJson = response.data;

    if (!resJson || !resJson.success || !resJson.data) {
      throw new Error(resJson?.message || 'Invalid API data structure.');
    }

    const { project, modules } = resJson.data;

    // 1. Map Roadmap Modules
    const mappedModules: CategoryGroup[] = Array.isArray(modules)
      ? modules.map(
          (module: RawModuleFromAPI): CategoryGroup => ({
            category: (module?.title || '').toUpperCase(),
            tasks: Array.isArray(module?.tasks)
              ? module.tasks.map(
                  (task: RawTaskFromAPI): Task => ({
                    id: task?._id || task?.id || '',
                    title: task?.title || '',
                    status: mapTaskStatus(task?.status),
                  }),
                )
              : [],
          }),
        )
      : [];

    // 2. Compute UI-specific logic
    const calculatedProgress = calculateProgress(
      mappedModules,
      project?.progressPercentage,
    );
    const defaultTaskId = getFirstTaskId(mappedModules);

    // 3. Map Project Details
    const mappedProject: ProjectDetails | null = project
      ? {
          title: project.title,
          description: project.description,
          progressPercentage: calculatedProgress,
        }
      : null;

    return {
      project: mappedProject,
      modules: mappedModules,
      defaultTaskId,
      calculatedProgress,
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

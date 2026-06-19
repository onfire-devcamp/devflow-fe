import type {
  CategoryGroup,
  RawModuleFromAPI,
  RawTaskFromAPI,
  Task,
  TaskStatus,
} from '../../roadmap/RoadmapType';

export const mapTaskStatus = (status?: string): TaskStatus => {
  if (status === 'completed' || status === 'passed') return 'completed';
  if (status === 'current' || status === 'unlocked') return 'current';
  return 'locked';
};

export const mapModuleToCategoryGroup = (
  module: RawModuleFromAPI,
): CategoryGroup => ({
  category: (module?.title || '').toUpperCase(),
  tasks: Array.isArray(module?.tasks)
    ? module.tasks.map(
        (task: RawTaskFromAPI): Task => ({
          id: task?._id || task?.id || '',
          title: task?.title || '',
          status: mapTaskStatus(task?.status),
          skillPoints: task?.skillPoints || 0,
          aiScore: task?.aiScore,
        }),
      )
    : [],
});

export const pickInitialActiveTaskId = (roadmap: CategoryGroup[]): string => {
  const firstCurrentTask = roadmap
    .flatMap((group) => group.tasks)
    .find((task) => task.status === 'current');

  if (firstCurrentTask) return firstCurrentTask.id;

  const firstIncompleteTask = roadmap
    .flatMap((group) => group.tasks)
    .find((task) => task.status !== 'completed');

  return firstIncompleteTask?.id ?? roadmap[0]?.tasks[0]?.id ?? '';
};

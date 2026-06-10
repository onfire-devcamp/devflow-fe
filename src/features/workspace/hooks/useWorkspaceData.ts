import { useState, useEffect } from 'react';
import { workspaceApi } from '../api/workspaceApi';
import { useApi } from '../../roadmap/UseAPI';
import type {
  CategoryGroup,
  ProjectDetails,
  RawModuleFromAPI,
  RawTaskFromAPI,
  Task,
  APIRoadmapResponse,
} from '../../roadmap/RoadmapType';

const mapTaskStatus = (status?: string): 'completed' | 'current' | 'locked' => {
  if (status === 'completed' || status === 'passed') return 'completed';
  if (status === 'current' || status === 'unlocked') return 'current';
  return 'locked';
};

const mapModuleToCategoryGroup = (module: RawModuleFromAPI): CategoryGroup => ({
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
});

const pickInitialActiveTaskId = (roadmap: CategoryGroup[]): string => {
  const firstCurrentTask = roadmap
    .flatMap((group) => group.tasks)
    .find((task) => task.status === 'current');

  if (firstCurrentTask) return firstCurrentTask.id;

  const firstIncompleteTask = roadmap
    .flatMap((group) => group.tasks)
    .find((task) => task.status !== 'completed');

  return firstIncompleteTask?.id ?? roadmap[0]?.tasks[0]?.id ?? '';
};

export function useWorkspaceData(projectId: string | undefined) {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null,
  );
  const [roadmapData, setRoadmapData] = useState<CategoryGroup[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string>('');

  const {
    execute: fetchRoadmap,
    loading,
    error,
  } = useApi<APIRoadmapResponse, [string]>(workspaceApi.fetchProjectRoadmap);

  useEffect(() => {
    if (!projectId || projectId === 'undefined') return;

    fetchRoadmap(projectId).then((response) => {
      if (!response || !response.success || !response.data) return;

      const { project, modules } = response.data;

      if (project) {
        setProjectDetails({
          title: project.title,
          description: project.description,
          progressPercentage: project.progressPercentage,
        });
      }

      if (Array.isArray(modules)) {
        const formattedRoadmap = modules.map(mapModuleToCategoryGroup);

        setRoadmapData(formattedRoadmap);

        setActiveTaskId((current) => {
          if (current) return current;
          return pickInitialActiveTaskId(formattedRoadmap);
        });
      }
    });
  }, [projectId, fetchRoadmap]);

  const markCurrentTaskCompleted = () => {
    setRoadmapData((prev) => {
      const updatedRoadmap = prev.map((group) => {
        const hasActiveTask = group.tasks.some(
          (task) => task.id === activeTaskId,
        );
        if (!hasActiveTask) return group;

        return {
          ...group,
          tasks: group.tasks.map((task) =>
            task.id === activeTaskId
              ? { ...task, status: 'completed' as const }
              : task,
          ),
        };
      });

      const currentGroupIndex = updatedRoadmap.findIndex((group) =>
        group.tasks.some((task) => task.id === activeTaskId),
      );

      if (currentGroupIndex === -1) return updatedRoadmap;

      const isModuleFullyCompleted = updatedRoadmap[
        currentGroupIndex
      ].tasks.every((task) => task.status === 'completed');

      if (
        !isModuleFullyCompleted ||
        currentGroupIndex + 1 >= updatedRoadmap.length
      ) {
        return updatedRoadmap;
      }

      return updatedRoadmap.map((group, index) => {
        if (index !== currentGroupIndex + 1) return group;

        return {
          ...group,
          tasks: group.tasks.map((task) =>
            task.status === 'completed'
              ? task
              : { ...task, status: 'current' as const },
          ),
        };
      });
    });
  };

  return {
    projectDetails,
    roadmapData,
    activeTaskId,
    setActiveTaskId,
    loading,
    error,
    markCurrentTaskCompleted,
  };
}

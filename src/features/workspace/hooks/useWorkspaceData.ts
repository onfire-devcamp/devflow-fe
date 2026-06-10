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
        const formattedRoadmap: CategoryGroup[] = modules.map(
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
        );

        setRoadmapData(formattedRoadmap);

        setActiveTaskId((current) => {
          if (current) return current;
          if (
            formattedRoadmap.length > 0 &&
            formattedRoadmap[0].tasks.length > 0
          ) {
            return formattedRoadmap[0].tasks[0].id;
          }
          return current;
        });
      }
    });
  }, [projectId, fetchRoadmap]);

  const markCurrentTaskCompleted = () => {
    setRoadmapData((prev) =>
      prev.map((group) => {
        const activeIndex = group.tasks.findIndex(
          (task) => task.id === activeTaskId,
        );

        if (activeIndex === -1) return group;

        return {
          ...group,
          tasks: group.tasks.map((task, index) => {
            if (task.id === activeTaskId) {
              return { ...task, status: 'completed' as const };
            }

            if (index === activeIndex + 1 && task.status === 'locked') {
              return { ...task, status: 'current' as const };
            }

            return task;
          }),
        };
      }),
    );
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

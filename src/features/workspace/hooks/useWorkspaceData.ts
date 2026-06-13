import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { workspaceApi } from '../api/workspaceApi';
import {
  mapModuleToCategoryGroup,
  pickInitialActiveTaskId,
} from '../utils/helpers';
import type { APIRoadmapResponse } from '../../roadmap/RoadmapType';

export function useWorkspaceData(projectId: string | undefined) {
  const queryClient = useQueryClient();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['roadmap', projectId],
    queryFn: () => workspaceApi.fetchProjectRoadmap(projectId as string),
    enabled: !!projectId && projectId !== 'undefined',
    select: (response: APIRoadmapResponse) => {
      const projectDetails = response.data?.project
        ? {
            title: response.data.project.title,
            description: response.data.project.description,
            progressPercentage: response.data.project.progressPercentage,
          }
        : null;

      const roadmapData =
        response.data?.modules?.map(mapModuleToCategoryGroup) ?? [];

      return { projectDetails, roadmapData };
    },
  });

  const projectDetails = data?.projectDetails ?? null;
  const roadmapData = data?.roadmapData ?? [];

  const activeTaskId =
    selectedTaskId ||
    (roadmapData.length > 0 ? pickInitialActiveTaskId(roadmapData) : '');

  const error = queryError ? queryError.message : null;

  const markCurrentTaskCompleted = () => {
    queryClient.invalidateQueries({ queryKey: ['roadmap', projectId] });
  };

  return {
    projectDetails,
    roadmapData,
    activeTaskId,
    setActiveTaskId: setSelectedTaskId,
    loading,
    error,
    markCurrentTaskCompleted,
  };
}

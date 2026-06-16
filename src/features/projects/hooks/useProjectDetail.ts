import { useQuery } from '@tanstack/react-query';
import { getProjectBySlug } from '../api/projectsApi';
import type { ProjectDetail } from '../types/projectTypes';

type UseProjectDetailState = {
  project: ProjectDetail | null;
  isLoading: boolean;
  error: string | null;
};

export function useProjectDetail(
  slug: string | undefined,
): UseProjectDetailState {
  const {
    data: project,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => getProjectBySlug(slug!),
    enabled: !!slug,
  });

  return {
    project: project ?? null,
    isLoading,
    error: queryError ? (queryError as Error).message : null,
  };
}

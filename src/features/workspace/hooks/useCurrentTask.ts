// TODO: Add workspace hooks here.
import { useMemo } from 'react';
import { usePlatformStore } from '../store/usePlatformStore';
import type { Project, Task } from '../types';

export function useCurrentTask() {
  const {
    projects,
    activeProjectId,
    activeTaskId,
    browsingFile,
    setBrowsingFile,
  } = usePlatformStore();

  // 1. Selectors / Deriving states
  const currentProj = useMemo<Project | undefined>(
    () => (projects as Project[]).find((p) => p.id === activeProjectId),
    [projects, activeProjectId],
  );

  const allTasks = useMemo<Task[]>(
    () => currentProj?.sections.flatMap((s) => s.tasks) || [],
    [currentProj],
  );

  // 2. Hash Maps
  const taskById = useMemo<Record<string, Task>>(() => {
    return Object.fromEntries(allTasks.map((task) => [task.id, task]));
  }, [allTasks]);

  const taskByFileName = useMemo<Record<string, Task>>(() => {
    return Object.fromEntries(allTasks.map((task) => [task.fileName, task]));
  }, [allTasks]);

  const currentTask = taskById[activeTaskId];

  const isReadOnly =
    browsingFile !== null && browsingFile !== currentTask?.fileName;

  const displayFileName =
    browsingFile || currentTask?.fileName || 'src/router.tsx';

  const defaultCode =
    taskByFileName[displayFileName]?.skeletonCode || '// File empty';

  const xpRewards = currentTask?.worthXp || 30;

  return {
    currentTask,
    isReadOnly,
    displayFileName,
    defaultCode,
    xpRewards,
    setBrowsingFile,
  };
}

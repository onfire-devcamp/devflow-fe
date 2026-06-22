import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileTree } from '../../../components/ui/FileTree';
import { buildFileTreeFromPaths } from '../../../utils/fileTreeUtils';
import { getProjectCodebase } from '../../projects/api/projectsApi';
import type {
  TaskDetailsState,
  CategoryGroup,
} from '../../roadmap/RoadmapType';
import type { FileNode } from '../../projects/types/fileTree';
import { axiosClient } from '../../../lib/axiosClient';

interface ExplorerTabProps {
  projectId: string;
  projectSlug: string;
  activeTaskId: string;
  activeFileId: string | null;
  taskDetails: TaskDetailsState | null;
  roadmapData: CategoryGroup[];
  onFileSelect: (fileId: string) => void;
}

export function ExplorerTab({
  projectId,
  projectSlug,
  activeFileId,
  taskDetails,
  onFileSelect,
}: ExplorerTabProps) {
  const { data: codebase, isLoading: isCodebaseLoading } = useQuery({
    queryKey: ['projectCodebase', projectSlug],
    queryFn: () => getProjectCodebase(projectSlug),
    enabled: !!projectSlug,
  });

  const { data: userFilesResponse } = useQuery({
    queryKey: ['userWorkspace', projectId],
    queryFn: () => axiosClient.get(`/workspace/${projectId}`),
    enabled: !!projectId,
  });

  const fileTree = useMemo(() => {
    if (!codebase) return [];

    const userFiles = userFilesResponse?.data || [];
    const currentTaskFileIds = new Set(
      taskDetails?.files.map((f) => f._id) || [],
    );
    const userFileIds = new Set(
      userFiles.map(
        (f: import('../../workspace/types').UserWorkspaceFileView) =>
          f.fileId._id,
      ),
    );

    return buildFileTreeFromPaths(
      codebase.map((file) => {
        const isCurrentTask = currentTaskFileIds.has(file._id);
        const hasUserFile = userFileIds.has(file._id);

        // If it's not the current task, and the user hasn't touched it, it's locked.
        // However, read-only foundational files are NEVER locked.
        const isLocked = !file.readOnly && !isCurrentTask && !hasUserFile;
        const isCompleted = !isCurrentTask && hasUserFile;

        return {
          id: file._id,
          path: file.path,
          content: file.content,
          isLocked,
          isCurrentTask,
          isCompleted,
          readOnly: file.readOnly,
        };
      }),
    );
  }, [codebase, taskDetails, userFilesResponse?.data]);

  const handleNodeSelect = useCallback(
    (node: FileNode) => {
      if (node.type === 'file') {
        onFileSelect(node.id);
      }
    },
    [onFileSelect],
  );

  if (isCodebaseLoading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center gap-2"
            style={{ paddingLeft: `${(i % 3) * 12}px` }}
          >
            <div className="w-4 h-4 bg-slate-200 rounded" />
            <div
              className={`h-3 bg-slate-200 rounded`}
              style={{ width: `${60 + ((i * 15) % 60)}px` }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <FileTree
        data={fileTree}
        activeFileId={activeFileId}
        onNodeSelect={handleNodeSelect}
      />
    </div>
  );
}

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { editor } from 'monaco-editor';
import { useQuery, useMutation } from '@tanstack/react-query';
import { workspaceApi } from '../api/workspaceApi';
import type { TaskFile } from '../../roadmap/RoadmapType';
import { useQueryClient } from '@tanstack/react-query';
import { getProjectCodebase } from '../../projects/api/projectsApi';

export function useTaskEditor(
  projectId: string | undefined,
  projectSlug: string | undefined,
  activeTaskId: string,
) {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [editorInstance, setEditorInstance] =
    useState<editor.IStandaloneCodeEditor | null>(null);
  const [hasSelection, setHasSelection] = useState<boolean>(false);
  const [prevTaskId, setPrevTaskId] = useState(activeTaskId);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'editing'>(
    'saved',
  );
  const queryClient = useQueryClient();
  if (activeTaskId !== prevTaskId) {
    setPrevTaskId(activeTaskId);
    setActiveFileId(null);
    setEdits({});
    setHasSelection(false);
  }

  const { data: taskDetails, isLoading: loadingTask } = useQuery({
    queryKey: ['taskDetails', activeTaskId],
    queryFn: () => workspaceApi.fetchTaskDetails(activeTaskId),
    enabled: !!activeTaskId,
    select: (res) => {
      const fetchedTask = res?.data?.task;
      return fetchedTask
        ? {
            _id: fetchedTask._id,
            title: fetchedTask.title,
            description: fetchedTask.description,
            skillPoints: fetchedTask.skillPoints || 10,
            mcq: fetchedTask.mcq,
            files: fetchedTask.fileId || [],
          }
        : null;
    },
  });

  const { data: userFilesResponse } = useQuery({
    queryKey: ['userWorkspace', projectId],
    queryFn: () => workspaceApi.fetchUserWorkspaceFiles(projectId!),
    enabled: !!projectId,
  });

  const { data: codebaseResponse } = useQuery({
    queryKey: ['projectCodebase', projectSlug],
    queryFn: () => getProjectCodebase(projectSlug!),
    enabled: !!projectSlug,
  });

  const activeFileIdToUse =
    activeFileId || taskDetails?.files?.[0]?._id || null;

  const activeFileState = useMemo<'current' | 'completed' | 'locked'>(() => {
    if (!activeFileIdToUse) return 'current';
    if (taskDetails?.files.some((f) => f._id === activeFileIdToUse))
      return 'current';

    const userFiles = userFilesResponse?.data || [];
    if (userFiles.some((f) => f.fileId._id === activeFileIdToUse))
      return 'completed';

    return 'locked';
  }, [activeFileIdToUse, taskDetails, userFilesResponse?.data]);

  const fileContents = useMemo(() => {
    const contents: Record<string, string> = {};

    // 1. Lowest priority: skeleton code from full codebase
    if (codebaseResponse) {
      codebaseResponse.forEach((file) => {
        if (file.content) {
          contents[file._id] = file.content;
        }
      });
    }

    // 2. Middle priority: user's completed files
    const userFiles = userFilesResponse?.data || [];
    userFiles.forEach(
      (uf: import('../../workspace/types').UserWorkspaceFileView) => {
        const id = uf.fileId._id;
        contents[id] = uf.content;
      },
    );

    // 3. Highest priority: current task files and active edits
    if (taskDetails) {
      taskDetails.files.forEach((f: TaskFile) => {
        contents[f._id] =
          edits[f._id] !== undefined ? edits[f._id] : f.content || '';
      });
    }

    return contents;
  }, [taskDetails, edits, userFilesResponse?.data, codebaseResponse]);

  const currentContent = activeFileIdToUse
    ? fileContents[activeFileIdToUse]
    : undefined;

  const isCodeModified = useMemo(() => {
    if (!taskDetails || !activeFileIdToUse || currentContent === undefined) {
      return false;
    }
    const activeFile = taskDetails.files.find(
      (f) => f._id === activeFileIdToUse,
    );
    if (!activeFile) return false;

    const originalContent = (
      activeFile.skeleton ??
      activeFile.content ??
      ''
    ).trim();
    const currentTrimmed = currentContent.trim();

    return originalContent !== currentTrimmed;
  }, [taskDetails, activeFileIdToUse, currentContent]);

  const { mutate: autoSave } = useMutation({
    mutationFn: workspaceApi.autoSaveTaskFile,
    onMutate: () => setSaveStatus('saving'),
    onSuccess: () => {
      setSaveStatus('saved');
      void queryClient.invalidateQueries({
        queryKey: ['taskDetails', activeTaskId],
      });
    },
    onError: (err) => {
      console.error('Auto-save failed:', err);
      setSaveStatus('saved');
    },
  });

  useEffect(() => {
    if (
      !projectId ||
      !activeFileIdToUse ||
      currentContent === undefined ||
      saveStatus !== 'editing'
    )
      return;

    const delayDebounceTimer = setTimeout(() => {
      autoSave({
        projectId: projectId.trim(),
        fileId: activeFileIdToUse,
        newContent: currentContent,
      });
    }, 800);

    return () => clearTimeout(delayDebounceTimer);
  }, [currentContent, activeFileIdToUse, projectId, autoSave, saveStatus]);

  const handleEditorMount = (instance: editor.IStandaloneCodeEditor) => {
    setEditorInstance(instance);
    instance.onDidChangeCursorSelection((e) => {
      const selection = e.selection;
      const hasText = !selection.isEmpty();
      setHasSelection(hasText);
    });
  };

  const forceSave = useCallback(() => {
    if (
      activeFileIdToUse &&
      projectId &&
      fileContents[activeFileIdToUse] !== undefined &&
      saveStatus === 'editing'
    ) {
      autoSave({
        projectId: projectId.trim(),
        fileId: activeFileIdToUse,
        newContent: fileContents[activeFileIdToUse],
      });
    }
  }, [activeFileIdToUse, projectId, fileContents, autoSave, saveStatus]);

  const handleFileSelect = (newFileId: string) => {
    forceSave();
    setActiveFileId(newFileId);
  };

  const handleEditorChange = (fileId: string, value: string | undefined) => {
    if (fileId) {
      setSaveStatus('editing');
      setEdits((prev) => ({
        ...prev,
        [fileId]: value || '',
      }));
    }
  };

  const handleResetToSkeleton = () => {
    if (activeFileIdToUse && taskDetails) {
      const activeFile = taskDetails.files.find(
        (f) => f._id === activeFileIdToUse,
      );
      setEdits((prev) => ({
        ...prev,
        [activeFileIdToUse]: activeFile?.skeleton ?? activeFile?.content ?? '',
      }));
    }
  };

  return {
    taskDetails,
    loadingTask,
    activeFileId: activeFileIdToUse,
    setActiveFileId,
    forceSave,
    handleFileSelect,
    fileContents,
    editorInstance,
    hasSelection,
    isCodeModified,
    saveStatus,
    handleEditorMount,
    handleEditorChange,
    handleResetToSkeleton,
    activeFileState,
  };
}

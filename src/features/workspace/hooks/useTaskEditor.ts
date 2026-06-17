import { useState, useCallback, useMemo, useEffect } from 'react';
import type { editor } from 'monaco-editor';
import { useQuery, useMutation } from '@tanstack/react-query';
import { workspaceApi } from '../api/workspaceApi';
import type { TaskFile } from '../../roadmap/RoadmapType';
import { useQueryClient } from '@tanstack/react-query';
export function useTaskEditor(
  projectId: string | undefined,
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

  const activeFileIdToUse =
    activeFileId || taskDetails?.files?.[0]?._id || null;

  const fileContents = useMemo(() => {
    const contents: Record<string, string> = {};
    if (taskDetails) {
      taskDetails.files.forEach((f: TaskFile) => {
        contents[f._id] =
          edits[f._id] !== undefined ? edits[f._id] : f.content || '';
      });
    }
    const userFiles = userFilesResponse?.data || [];
    // Add userFiles so old completed files can be viewed
    userFiles.forEach(
      (uf: import('../../workspace/types').UserWorkspaceFileView) => {
        const id = uf.fileId._id;
        if (contents[id] === undefined) {
          contents[id] = uf.content;
        }
      },
    );

    return contents;
  }, [taskDetails, edits, userFilesResponse?.data]);

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
  };
}

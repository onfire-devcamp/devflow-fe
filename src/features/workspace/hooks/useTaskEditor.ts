import { useState, useCallback, useMemo, useEffect } from 'react';
import type { editor } from 'monaco-editor';
import { useQuery, useMutation } from '@tanstack/react-query';
import { workspaceApi } from '../api/workspaceApi';
import type { TaskFile } from '../../roadmap/RoadmapType';

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

  // Sync state cleanly without effects
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
    return contents;
  }, [taskDetails, edits]);

  const currentContent = activeFileIdToUse
    ? fileContents[activeFileIdToUse]
    : undefined;

  const { mutate: autoSave } = useMutation({
    mutationFn: workspaceApi.autoSaveTaskFile,
    onError: (err) => console.error('Auto-save failed:', err),
  });

  // Debounced Auto-save Engine (800ms)
  useEffect(() => {
    if (!projectId || !activeFileIdToUse || currentContent === undefined)
      return;

    const delayDebounceTimer = setTimeout(() => {
      autoSave({
        projectId: projectId.trim(),
        fileId: activeFileIdToUse,
        newContent: currentContent,
      });
    }, 800);

    return () => clearTimeout(delayDebounceTimer);
  }, [currentContent, activeFileIdToUse, projectId, autoSave]);

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
      fileContents[activeFileIdToUse] !== undefined
    ) {
      autoSave({
        projectId: projectId.trim(),
        fileId: activeFileIdToUse,
        newContent: fileContents[activeFileIdToUse],
      });
    }
  }, [activeFileIdToUse, projectId, fileContents, autoSave]);

  const handleFileSelect = (newFileId: string) => {
    forceSave();
    setActiveFileId(newFileId);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeFileIdToUse) {
      setEdits((prev) => ({
        ...prev,
        [activeFileIdToUse]: value || '',
      }));
    }
  };

  const handleResetToSkeleton = () => {
    if (
      window.confirm(
        'Are you sure? This will delete your current code and reset to the starter template.',
      )
    ) {
      if (activeFileIdToUse && taskDetails) {
        const activeFile = taskDetails.files.find(
          (f) => f._id === activeFileIdToUse,
        );
        setEdits((prev) => ({
          ...prev,
          [activeFileIdToUse]:
            activeFile?.skeleton ?? activeFile?.content ?? '',
        }));
      }
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
    handleEditorMount,
    handleEditorChange,
    handleResetToSkeleton,
  };
}

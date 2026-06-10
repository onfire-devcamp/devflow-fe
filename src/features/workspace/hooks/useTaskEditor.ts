import { useState, useEffect, useCallback } from 'react';
import type { editor } from 'monaco-editor';
import { workspaceApi } from '../api/workspaceApi';
import { useApi } from '../../roadmap/UseAPI';
import type {
  TaskDetailsState,
  TaskFile,
  APITaskDetailsResponse,
} from '../../roadmap/RoadmapType';

export function useTaskEditor(
  projectId: string | undefined,
  activeTaskId: string,
) {
  const [taskDetails, setTaskDetails] = useState<TaskDetailsState | null>(null);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [editorInstance, setEditorInstance] =
    useState<editor.IStandaloneCodeEditor | null>(null);
  const [hasSelection, setHasSelection] = useState<boolean>(false);

  const { execute: fetchTaskDetails, loading: loadingTask } = useApi<
    APITaskDetailsResponse,
    [string]
  >(workspaceApi.fetchTaskDetails);

  useEffect(() => {
    if (!activeTaskId) return;

    fetchTaskDetails(activeTaskId).then((response) => {
      if (!response || !response.success || !response.data?.task) {
        setTaskDetails(null);
        return;
      }

      const fetchedTask = response.data.task;
      const files = fetchedTask.fileId || [];
      setTaskDetails({
        _id: fetchedTask._id,
        title: fetchedTask.title,
        description: fetchedTask.description,
        skillPoints: fetchedTask.skillPoints || 10,
        mcq: fetchedTask.mcq,
        files: fetchedTask.fileId || [],
      });

      setFileContents((prev) => {
        const nextContents = { ...prev };
        files.forEach((f: TaskFile) => {
          if (nextContents[f._id] === undefined) {
            nextContents[f._id] = f.content || '';
          }
        });
        return nextContents;
      });

      if (files.length > 0) {
        setActiveFileId(files[0]._id);
      } else {
        setActiveFileId(null);
      }
    });
  }, [activeTaskId, fetchTaskDetails]);

  const currentContent = activeFileId ? fileContents[activeFileId] : undefined;

  // Debounced Auto-save Engine (800ms)
  useEffect(() => {
    if (!projectId || !activeFileId) return;
    if (currentContent === undefined) return;

    const delayDebounceTimer = setTimeout(async () => {
      try {
        await workspaceApi.autoSaveTaskFile({
          projectId: projectId.trim(),
          fileId: activeFileId,
          newContent: currentContent,
        });
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, 800);

    return () => clearTimeout(delayDebounceTimer);
  }, [currentContent, activeFileId, projectId]);

  const handleEditorMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    setEditorInstance(editorInstance);
    editorInstance.onDidChangeCursorSelection((e) => {
      const selection = e.selection;
      const hasText = !selection.isEmpty();
      setHasSelection(hasText);
    });
  };

  const forceSave = useCallback(() => {
    if (activeFileId && projectId && fileContents[activeFileId] !== undefined) {
      workspaceApi
        .autoSaveTaskFile({
          projectId: projectId.trim(),
          fileId: activeFileId,
          newContent: fileContents[activeFileId],
        })
        .catch((err) => console.error('Auto-save error on force save:', err));
    }
  }, [activeFileId, projectId, fileContents]);

  const handleFileSelect = (newFileId: string) => {
    forceSave();
    setActiveFileId(newFileId);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeFileId) {
      setFileContents((prev) => ({
        ...prev,
        [activeFileId]: value || '',
      }));
    }
  };

  const handleResetToSkeleton = () => {
    if (
      window.confirm(
        'Are you sure? This will delete your current code and reset to the starter template.',
      )
    ) {
      if (activeFileId && taskDetails) {
        const activeFile = taskDetails.files.find(
          (f) => f._id === activeFileId,
        );
        setFileContents((prev) => ({
          ...prev,
          [activeFileId]: activeFile?.skeleton ?? activeFile?.content ?? '',
        }));
      }
    }
  };

  return {
    taskDetails,
    loadingTask,
    activeFileId,
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

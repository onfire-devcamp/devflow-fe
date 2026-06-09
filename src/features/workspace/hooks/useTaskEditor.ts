import { useState, useEffect } from 'react';
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

      const initialContents: Record<string, string> = {};
      files.forEach((f: TaskFile) => {
        initialContents[f._id] = f.content || '';
      });
      setFileContents(initialContents);

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

  const handleFileSelect = (newFileId: string) => {
    if (activeFileId && projectId && fileContents[activeFileId] !== undefined) {
      workspaceApi
        .autoSaveTaskFile({
          projectId: projectId.trim(),
          fileId: activeFileId,
          newContent: fileContents[activeFileId],
        })
        .catch((err) => console.error('Auto-save error on file switch:', err));
    }
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
    if (activeFileId && taskDetails) {
      const activeFile = taskDetails.files.find((f) => f._id === activeFileId);
      setFileContents((prev) => ({
        ...prev,
        [activeFileId]: activeFile?.content || '',
      }));
    }
  };

  return {
    taskDetails,
    loadingTask,
    activeFileId,
    setActiveFileId,
    handleFileSelect,
    fileContents,
    editorInstance,
    hasSelection,
    handleEditorMount,
    handleEditorChange,
    handleResetToSkeleton,
  };
}

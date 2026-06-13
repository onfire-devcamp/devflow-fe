import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { workspaceApi } from '../api/workspaceApi';
import { Header } from '../../../components/ui/Header';
import { SidebarHeader } from '../../roadmap/components/SideBarHeader';
import { TabSwitcher } from '../../roadmap/components/TabSwitcher';
import { ProgressBar } from '../../roadmap/components/ProgressBar';
import { TaskList } from '../../roadmap/components/TaskList';
import { useWorkspaceData } from '../hooks/useWorkspaceData';
import { useTaskEditor } from '../hooks/useTaskEditor';
import { useDeviChat } from '../hooks/useDeviChat';
import { WorkspaceEditor } from '../components/WorkspaceEditor';
import { WorkspaceFooter } from '../components/WorkspaceFooter';
import { DeviChatPanel } from '../components/DeviChatPanel';
import { ExplainToPassModal } from '../components/ExplainToPassModal';
import { GlobalLoader } from '../../../components/ui/GlobalLoader';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';

export default function WorkspacePage() {
  const { projectSlug } = useParams<{ projectSlug: string }>();

  const {
    data: slugProjectDetails,
    isLoading: isSlugLoading,
    error: slugError,
  } = useQuery({
    queryKey: ['projectSlug', projectSlug],
    queryFn: () => workspaceApi.fetchProjectBySlug(projectSlug!),
    enabled: !!projectSlug,
  });

  const projectId = slugProjectDetails?.id;

  const {
    projectDetails,
    roadmapData,
    activeTaskId,
    setActiveTaskId,
    loading,
    error,
    markCurrentTaskCompleted,
  } = useWorkspaceData(projectId);

  const {
    taskDetails,
    loadingTask,
    activeFileId,
    forceSave,
    handleFileSelect,
    fileContents,
    editorInstance,
    hasSelection,
    handleEditorMount,
    handleEditorChange,
    handleResetToSkeleton,
  } = useTaskEditor(projectId, activeTaskId);

  const {
    messages,
    isChatting,
    isEvaluating,
    isLoadingHistory,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    handleSubmitCode,
    handleExplainToPassSubmit,
    handleQuickAction,
    handleSendTextMessage,
  } = useDeviChat({
    projectId,
    activeTaskId,
    activeFileId,
    editorInstance,
    taskDetails: taskDetails ?? null,
    onTaskCompleted: markCurrentTaskCompleted,
  });

  const [showExplainToPassForm, setShowExplainToPassForm] = useState(false);

  const handleOpenExplainToPass = useCallback(() => {
    setShowExplainToPassForm(true);
  }, []);

  const handleCloseExplainToPass = useCallback(() => {
    setShowExplainToPassForm(false);
  }, []);

  const onExplainToPassSubmit = (mcqAnswer: string, explanation: string) => {
    handleExplainToPassSubmit(mcqAnswer, explanation);
    setShowExplainToPassForm(false);
  };

  const currentProjectName = projectDetails?.title || 'Loading project...';
  const currentProgress = projectDetails?.progressPercentage ?? 0;

  const handleTaskSelect = (newTaskId: string) => {
    if (newTaskId === activeTaskId) return;
    forceSave();
    setActiveTaskId(newTaskId);
  };

  const currentCategory = roadmapData.find((group) =>
    group.tasks.some((task) => task.id === activeTaskId),
  )?.category;

  if (isSlugLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-fg">
        <GlobalLoader />
      </div>
    );
  }

  if (slugError || error) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg px-6">
        <ErrorMessage
          message={
            (slugError as Error)?.message || error || 'An error occurred'
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg select-none overflow-hidden text-fg">
      <Header />
      <div className="flex flex-1 overflow-hidden w-full">
        <aside className="hidden lg:flex w-76 flex-shrink-0 border-r border-primary-mid bg-primary-soft flex-col justify-between overflow-y-auto">
          <div>
            <SidebarHeader projectName={currentProjectName} />
            <div className="p-4 space-y-5">
              <TabSwitcher />
              <ProgressBar progress={currentProgress} />
              <TaskList
                academyData={roadmapData}
                activeTaskId={activeTaskId}
                onTaskSelect={handleTaskSelect}
              />
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-bg p-4 sm:p-8 border-r border-slate-100 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full min-h-[500px]">
            {loadingTask ? (
              <div className="flex items-center justify-center h-full min-h-[400px] text-slate-400 text-sm">
                <div className="animate-pulse">Loading task contents...</div>
              </div>
            ) : taskDetails ? (
              <div className="space-y-4">
                <WorkspaceEditor
                  taskDetails={taskDetails}
                  activeFileId={activeFileId}
                  fileContents={fileContents}
                  hasSelection={hasSelection}
                  isEvaluating={isEvaluating}
                  isChatting={isChatting}
                  category={currentCategory}
                  onFileSelect={handleFileSelect}
                  onEditorMount={handleEditorMount}
                  onEditorChange={handleEditorChange}
                  onQuickAction={handleQuickAction}
                />

                <WorkspaceFooter
                  taskDetails={taskDetails}
                  isEvaluating={isEvaluating}
                  onResetToSkeleton={handleResetToSkeleton}
                  onSubmitCode={handleSubmitCode}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] text-slate-400 text-sm">
                Select a task from the roadmap to view workspace.
              </div>
            )}
          </div>
        </main>

        <DeviChatPanel
          messages={messages}
          isEvaluating={isEvaluating}
          isChatting={isChatting}
          isLoadingHistory={isLoadingHistory}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onLoadOlderMessages={() => void fetchNextPage()}
          onSendMessage={handleSendTextMessage}
          onOpenExplainToPass={handleOpenExplainToPass}
        />

        <ExplainToPassModal
          taskDetails={taskDetails ?? null}
          showForm={showExplainToPassForm}
          isEvaluating={isEvaluating}
          onSubmit={onExplainToPassSubmit}
          onClose={handleCloseExplainToPass}
        />
      </div>
    </div>
  );
}

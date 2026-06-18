import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { workspaceApi } from '../api/workspaceApi';
import { Header } from '../../../components/ui/Header';
import { SidebarHeader } from '../../roadmap/components/SideBarHeader';
import { TabSwitcher } from '../../roadmap/components/TabSwitcher';
import { ProgressBar } from '../../roadmap/components/ProgressBar';
import { TaskList } from '../../roadmap/components/TaskList';
import { pickInitialActiveTaskId } from '../utils/helpers';
import { useWorkspaceData } from '../hooks/useWorkspaceData';
import { useTaskEditor } from '../hooks/useTaskEditor';
import { useDeviChat } from '../hooks/useDeviChat';
import { WorkspaceEditor } from '../components/WorkspaceEditor';
import { WorkspaceFooter } from '../components/WorkspaceFooter';
import { DeviChatPanel } from '../components/DeviChatPanel';
import { ExplainToPassModal } from '../components/ExplainToPassModal';
import { GlobalLoader } from '../../../components/ui/GlobalLoader';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { SidebarToggleIcon } from '../../roadmap/components/RoadmapIcons';
import { ExplorerTab } from '../components/ExplorerTab';

export default function WorkspacePage() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'explorer'>('roadmap');

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
    isCodeModified,
    saveStatus,
    handleEditorMount,
    handleEditorChange,
    handleResetToSkeleton,
    activeFileState,
  } = useTaskEditor(projectId, projectSlug, activeTaskId);

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
    handleExplainToPassSubmit(mcqAnswer, explanation, handleCloseExplainToPass);
  };

  const currentProjectName = projectDetails?.title || 'Loading project...';
  const currentProgress = projectDetails?.progressPercentage ?? 0;

  const handleTaskSelect = useCallback(
    (newTaskId: string) => {
      if (newTaskId === activeTaskId) return;
      forceSave();
      setActiveTaskId(newTaskId);
    },
    [activeTaskId, forceSave, setActiveTaskId],
  );

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleBackToActiveTask = useCallback(() => {
    const trueActiveTaskId =
      roadmapData.length > 0 ? pickInitialActiveTaskId(roadmapData) : null;
    if (trueActiveTaskId && trueActiveTaskId !== activeTaskId) {
      handleTaskSelect(trueActiveTaskId);
    }
  }, [roadmapData, activeTaskId, handleTaskSelect]);

  const currentCategory = roadmapData.find((group) =>
    group.tasks.some((task) => task.id === activeTaskId),
  )?.category;

  const activeTaskObj = roadmapData
    .flatMap((group) => group.tasks)
    .find((task) => task.id === activeTaskId);

  const isCompleted = activeTaskObj?.status === 'completed';

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
        <aside
          className={`hidden lg:flex flex-shrink-0 border-r border-primary-mid bg-primary-soft flex-col justify-between overflow-hidden transition-all duration-300 ${
            isSidebarOpen ? 'w-76' : 'w-0 border-r-0'
          }`}
        >
          <div className="w-76 overflow-y-auto h-full">
            <SidebarHeader
              projectName={currentProjectName}
              onToggleSidebar={handleToggleSidebar}
            />
            <div className="p-4 space-y-5">
              <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />
              <ProgressBar progress={currentProgress} />
              {activeTab === 'roadmap' ? (
                <TaskList
                  academyData={roadmapData}
                  activeTaskId={activeTaskId}
                  onTaskSelect={handleTaskSelect}
                />
              ) : (
                <ExplorerTab
                  projectId={projectId!}
                  projectSlug={projectSlug!}
                  activeTaskId={activeTaskId}
                  activeFileId={activeFileId}
                  taskDetails={taskDetails}
                  roadmapData={roadmapData}
                  onFileSelect={(fileId) => {
                    handleFileSelect(fileId);
                  }}
                />
              )}
            </div>
          </div>
        </aside>

        {!isSidebarOpen && (
          <button
            onClick={handleToggleSidebar}
            aria-label="Open Sidebar"
            className="hidden lg:flex items-center justify-center w-7 h-12 mt-4 flex-shrink-0 self-start bg-primary-soft border border-primary-mid border-l-0 rounded-r-lg hover:bg-primary-mid/30 transition-colors"
          >
            <SidebarToggleIcon className="w-4 h-4 rotate-180" />
          </button>
        )}

        <main className="flex-1 bg-bg p-4 sm:p-8 border-r border-slate-100 overflow-y-auto">
          <div className="relative max-w-3xl mx-auto w-full min-h-[500px]">
            {loadingTask ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
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
                  saveStatus={saveStatus}
                  isCompleted={isCompleted}
                  activeFileState={activeFileState}
                  onFileSelect={handleFileSelect}
                  onEditorMount={handleEditorMount}
                  onEditorChange={handleEditorChange}
                  onQuickAction={handleQuickAction}
                  onBackToActiveTask={handleBackToActiveTask}
                />

                <WorkspaceFooter
                  taskDetails={taskDetails}
                  isEvaluating={isEvaluating}
                  isCompleted={isCompleted}
                  isCodeModified={isCodeModified}
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

import { useState, useCallback } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
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
import { ProjectCompletionModal } from '../components/ProjectCompletionModal';
import { ProjectScorecardModal } from '../components/ProjectScorecardModal';

import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { SidebarToggleIcon } from '../../roadmap/components/RoadmapIcons';
import { ExplorerTab } from '../components/ExplorerTab';
import trophyImg from '../../../assets/trophy.png';

export default function WorkspacePage() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'explorer'>('roadmap');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showScorecardModal, setShowScorecardModal] = useState(false);

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

  const handleTaskCompleted = useCallback(() => {
    markCurrentTaskCompleted();
    const allTasks = roadmapData.flatMap((group) => group.tasks);
    const isLastTask = activeTaskId === allTasks[allTasks.length - 1]?.id;
    if (isLastTask) {
      setShowCompletionModal(true);
    }
  }, [markCurrentTaskCompleted, roadmapData, activeTaskId]);

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
    onTaskCompleted: handleTaskCompleted,
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

  const isProjectCompleted =
    roadmapData.length > 0 &&
    roadmapData.every((group) =>
      group.tasks.every((task) => task.status === 'completed'),
    );

  if (isSlugLoading || loading) {
    return (
      <div className="flex flex-col h-screen bg-bg animate-pulse">
        {/* Header skeleton */}
        <div className="h-14 border-b border-slate-200 bg-white" />
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar skeleton */}
          <div className="w-76 border-r border-slate-200 bg-slate-50 p-4 space-y-4 hidden lg:block">
            <div className="h-5 w-3/4 bg-slate-200 rounded" />
            <div className="h-2 w-full bg-slate-200 rounded-full" />
            <div className="space-y-3 pt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-slate-200 rounded-lg" />
              ))}
            </div>
          </div>
          {/* Main content skeleton */}
          <div className="flex-1 p-8 space-y-4">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-8 w-2/3 bg-slate-200 rounded" />
            <div className="h-4 w-full max-w-md bg-slate-200 rounded" />
            <div className="h-[420px] bg-slate-200 rounded-xl mt-6" />
          </div>
          {/* Chat panel skeleton */}
          <div className="w-[336px] border-l border-slate-200 bg-slate-50 p-4 space-y-3 hidden xl:block">
            <div className="h-5 w-1/2 bg-slate-200 rounded" />
            <div className="h-3 w-3/4 bg-slate-200 rounded" />
            <div className="flex-1" />
            <div className="h-9 bg-slate-200 rounded-lg mt-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (slugError || error) {
    const errorMsg =
      (slugError as Error)?.message?.toLowerCase() ||
      error?.toLowerCase() ||
      '';
    if (errorMsg.includes('404') || errorMsg.includes('not found')) {
      return <Navigate to="/404" replace />;
    }

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

  // If the workspace data indicates the user hasn't initialized the project, and we didn't just come from the start button
  if (
    projectDetails &&
    !projectDetails.isInitialized &&
    !location.state?.initializing
  ) {
    return <Navigate to={`/project/${projectSlug}`} replace />;
  }

  return (
    <div className="flex flex-col h-screen bg-bg select-none overflow-hidden text-fg relative">
      <div className="fixed inset-0 z-[100] bg-bg flex-col items-center justify-center p-6 text-center flex landscape:hidden sm:hidden portrait:flex">
        <div className="w-16 h-16 mb-4 animate-bounce flex items-center justify-center rounded-full bg-primary-soft text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Rotate your device</h2>
        <p className="text-fg-muted">
          For the best coding experience, please use your device in landscape
          mode.
        </p>
      </div>
      <Header />
      <div className="flex flex-1 overflow-hidden w-full relative">
        <aside
          className={`flex flex-shrink-0 border-r border-primary-mid bg-primary-soft flex-col justify-between overflow-hidden transition-all duration-300 absolute inset-y-0 left-0 z-50 lg:relative lg:z-0 lg:flex ${
            isSidebarOpen
              ? 'w-76 translate-x-0'
              : 'w-76 -translate-x-full lg:w-0 lg:translate-x-0 lg:border-r-0 lg:hidden'
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
                  taskDetails={taskDetails ?? null}
                  roadmapData={roadmapData}
                  onFileSelect={(fileId) => {
                    handleFileSelect(fileId);
                  }}
                />
              )}
            </div>
          </div>
        </aside>

        {/* Sidebar Toggle for Mobile/Desktop */}
        {!isSidebarOpen && (
          <button
            onClick={handleToggleSidebar}
            aria-label="Open Sidebar"
            className="flex items-center justify-center w-7 h-12 mt-4 flex-shrink-0 absolute left-0 z-40 lg:relative lg:z-0 bg-primary-soft border border-primary-mid border-l-0 rounded-r-lg hover:bg-primary-mid/30 transition-colors"
          >
            <SidebarToggleIcon className="w-4 h-4 rotate-180" />
          </button>
        )}

        {/* Chat Toggle for Mobile */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            aria-label="Open Chat"
            className="xl:hidden flex items-center justify-center w-7 h-12 mt-4 flex-shrink-0 absolute right-0 z-40 bg-primary-soft border border-primary-mid border-r-0 rounded-l-lg hover:bg-primary-mid/30 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-600"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        )}

        <main className="flex-1 bg-bg p-4 sm:p-8 border-r border-slate-100 overflow-y-auto">
          <div className="relative max-w-3xl mx-auto w-full min-h-[500px]">
            {loadingTask ? (
              <div className="absolute inset-0 flex flex-col gap-4 p-4 animate-pulse">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-7 w-2/3 bg-slate-200 rounded" />
                <div className="h-4 w-full max-w-sm bg-slate-200 rounded" />
                <div className="h-[420px] bg-slate-200 rounded-xl mt-4" />
              </div>
            ) : taskDetails ? (
              <div className="space-y-4">
                {isProjectCompleted && projectSlug && (
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between mb-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                        <img
                          src={trophyImg}
                          alt="Trophy"
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Project Completed!
                        </h3>
                        <p className="text-xs text-slate-500">
                          You've finished all tasks in this project.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowScorecardModal(true)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg shadow-md transition-colors cursor-pointer"
                    >
                      View Scorecard
                    </button>
                  </div>
                )}

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
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />

        <ExplainToPassModal
          taskDetails={taskDetails ?? null}
          showForm={showExplainToPassForm}
          isEvaluating={isEvaluating}
          onSubmit={onExplainToPassSubmit}
          onClose={handleCloseExplainToPass}
        />
      </div>

      {showCompletionModal && projectSlug && (
        <ProjectCompletionModal projectSlug={projectSlug} />
      )}

      {showScorecardModal && projectId && projectSlug && (
        <ProjectScorecardModal
          projectTitle={currentProjectName}
          projectSlug={projectSlug}
          projectId={projectId}
          roadmapData={roadmapData}
          isOpen={showScorecardModal}
          onClose={() => setShowScorecardModal(false)}
        />
      )}
    </div>
  );
}

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

export default function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>();

  // Workspace data hook - manages roadmap, project details, active task
  const {
    projectDetails,
    roadmapData,
    activeTaskId,
    setActiveTaskId,
    loading,
    error,
    markCurrentTaskCompleted,
  } = useWorkspaceData(projectId);

  // Task editor hook - manages Monaco editor, file contents, auto-save
  const {
    taskDetails,
    loadingTask,
    activeFileId,
    handleFileSelect,
    fileContents,
    editorInstance,
    hasSelection,
    handleEditorMount,
    handleEditorChange,
    handleResetToSkeleton,
  } = useTaskEditor(projectId, activeTaskId);

  // Devi chat hook - manages AI chat, code evaluation, explain-to-pass
  const {
    messages,
    isChatting,
    isEvaluating,
    inputMessage,
    setInputMessage,
    showExplainToPassForm,
    mcqAnswer,
    setMcqAnswer,
    explanation,
    setExplanation,
    resetChatForNewTask,
    handleSubmitCode,
    handleOpenExplainToPass,
    handleExplainToPassSubmit,
    handleQuickAction,
    handleSendTextMessage,
  } = useDeviChat({
    projectId,
    activeTaskId,
    activeFileId,
    editorInstance,
    taskDetails,
    onTaskCompleted: markCurrentTaskCompleted,
  });

  // Synchronization: Reset chat when task details change
  useEffect(() => {
    if (taskDetails) {
      resetChatForNewTask(taskDetails.title);
    }
  }, [taskDetails, resetChatForNewTask]);

  const currentProjectName = projectDetails?.title || 'Loading project...';
  const currentProgress = projectDetails?.progressPercentage ?? 0;

  const currentCategory = roadmapData.find((group) =>
    group.tasks.some((task) => task.id === activeTaskId),
  )?.category;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-fg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg px-6 text-center text-sm text-slate-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg select-none overflow-hidden text-fg">
      <Header />
      <div className="flex flex-1 overflow-hidden w-full">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex w-76 flex-shrink-0 border-r border-primary-mid bg-primary-soft flex-col justify-between overflow-y-auto">
          <div>
            <SidebarHeader projectName={currentProjectName} />
            <div className="p-4 space-y-5">
              <TabSwitcher />
              <ProgressBar progress={currentProgress} />
              <TaskList
                academyData={roadmapData}
                activeTaskId={activeTaskId}
                onTaskSelect={setActiveTaskId}
              />
            </div>
          </div>
        </aside>

        {/* MIDDLE MAIN CONTENT */}
        <main className="flex-1 bg-bg p-4 sm:p-8 border-r border-slate-100 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full min-h-[500px]">
            {loadingTask ? (
              <div className="flex items-center justify-center h-full min-h-[400px] text-slate-400 text-sm">
                <div className="animate-pulse">Loading task contents...</div>
              </div>
            ) : taskDetails ? (
              <div className="space-y-4">
                {/* Task Meta Header & Editor */}
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

                {/* Action Footer */}
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

        {/* RIGHT SIDEBAR: AI MENTOR CHAT INTERFACE */}
        <DeviChatPanel
          messages={messages}
          isEvaluating={isEvaluating}
          isChatting={isChatting}
          inputMessage={inputMessage}
          onInputChange={setInputMessage}
          onSendMessage={handleSendTextMessage}
          onOpenExplainToPass={handleOpenExplainToPass}
        />

        {/* EXPLAIN-TO-PASS MODAL */}
        <ExplainToPassModal
          taskDetails={taskDetails}
          showForm={showExplainToPassForm}
          mcqAnswer={mcqAnswer}
          explanation={explanation}
          isEvaluating={isEvaluating}
          onMcqAnswerChange={setMcqAnswer}
          onExplanationChange={setExplanation}
          onSubmit={handleExplainToPassSubmit}
          onClose={handleOpenExplainToPass}
        />
      </div>
    </div>
  );
}

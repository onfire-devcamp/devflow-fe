import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from '../../components/ui/Header';

import { SidebarHeader } from './components/SidebarHeader';
import { TabSwitcher } from './components/TabSwitcher';
import { ProgressBar } from './components/ProgressBar';
import { TaskList } from './components/TaskList';

import { roadmapService } from './RoadmapService';

export default function RoadmapLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const cleanProjectId = projectId?.trim();

  // FLOW 1: Fetch project roadmap data
  const {
    data: roadmapDataResult,
    isLoading: loading,
    error: apiError,
  } = useQuery({
    queryKey: ['roadmap', cleanProjectId],
    queryFn: () => roadmapService.getProjectRoadmap(cleanProjectId!),
    enabled: !!cleanProjectId && cleanProjectId !== 'undefined',
  });

  const projectDetails = roadmapDataResult?.project ?? null;

  const roadmapData = useMemo(() => {
    return roadmapDataResult?.modules ?? [];
  }, [roadmapDataResult]);

  const error = apiError instanceof Error ? apiError.message : null;

  // DYNAMIC COMPUTATION: Determine which task is actually active
  // If the user hasn't clicked anything yet, fallback to the very first task ID automatically
  const activeTaskId = useMemo(() => {
    if (selectedTaskId) return selectedTaskId;

    if (roadmapData.length > 0 && roadmapData[0].tasks.length > 0) {
      return roadmapData[0].tasks[0].id;
    }

    return '';
  }, [selectedTaskId, roadmapData]);

  // FLOW 2: Fetch task details using the derived activeTaskId
  const { data: taskDetails, isLoading: loadingTask } = useQuery({
    queryKey: ['taskDetails', activeTaskId],
    queryFn: () => roadmapService.getTaskDetails(activeTaskId),
    enabled: !!activeTaskId,
  });

  const currentProjectName = projectDetails?.title || 'Loading project...';

  // Dynamic progress fallback computation
  const currentProgress = useMemo(() => {
    if (projectDetails?.progressPercentage !== undefined) {
      return projectDetails.progressPercentage;
    }

    let totalTasks = 0;
    let completedTasks = 0;

    roadmapData.forEach((module) => {
      totalTasks += module.tasks.length;
      completedTasks += module.tasks.filter(
        (task) => task.status === 'completed',
      ).length;
    });

    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [projectDetails, roadmapData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-fg">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-slate-500">
            Loading project configuration...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-fg px-4">
        <div className="max-w-md w-full p-6 bg-red-50 border border-red-200 rounded-xl text-center">
          <p className="text-red-600 font-medium mb-3">Connection Error</p>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg select-none overflow-hidden text-fg">
      <Header />
      <div className="flex flex-1 overflow-hidden w-full">
        <aside className="hidden lg:flex w-76 flex-shrink-0 border-r border-primary-soft bg-primary-mid/10 bg-card flex-col justify-between overflow-y-auto">
          <div>
            <SidebarHeader projectName={currentProjectName} />
            <div className="p-4 space-y-5">
              <TabSwitcher />
              <ProgressBar progress={currentProgress} />
              <TaskList
                academyData={roadmapData}
                activeTaskId={activeTaskId}
                onTaskSelect={setSelectedTaskId}
              />
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-bg p-4 sm:p-8 border-r border-slate-100 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full min-h-[500px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {loadingTask ? (
              <div className="flex items-center justify-center h-full min-h-[400px] text-slate-400 text-sm">
                Loading task contents...
              </div>
            ) : taskDetails ? (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-bold text-slate-800">
                  {taskDetails.title}
                </h2>
                <div className="h-px bg-slate-100 w-full" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  {taskDetails.description ||
                    'This task has no content description.'}
                </p>
              </div>
            ) : (
              <div className="h-full min-h-[400px]" />
            )}
          </div>
        </main>

        <aside className="hidden xl:flex w-80 flex-shrink-0 bg-card border-l border-slate-100 flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-sm">AI Mentor Assistant</h3>
          </div>
          <div className="flex-1" />
        </aside>
      </div>
    </div>
  );
}

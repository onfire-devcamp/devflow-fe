import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/ui/Header';

import { SidebarHeader } from './components/SidebarHeader';
import { TabSwitcher } from './components/TabSwitcher';
import { ProgressBar } from './components/ProgressBar';
import { TaskList } from './components/TaskList';

import type {
  Task,
  CategoryGroup,
  ProjectDetails,
  TaskDetails,
  APIRoadmapResponse,
  APITaskDetailsResponse,
  RawModuleFromAPI,
  RawTaskFromAPI,
} from './RoadmapType';

export default function RoadmapLayout() {
  const { projectId } = useParams<{ projectId: string }>();

  const [activeTaskId, setActiveTaskId] = useState<string>('');
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null,
  );
  const [roadmapData, setRoadmapData] = useState<CategoryGroup[]>([]);

  const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null);
  const [loadingTask, setLoadingTask] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // FLOW 1: Fetch Project Details and Roadmap Modules (Runs once on mount)
  useEffect(() => {
    if (!projectId || projectId === 'undefined') return;

    const fetchWorkspaceData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/project/${projectId.trim()}/roadmap`,
        );
        if (!response.ok) {
          throw new Error(
            'Failed to fetch valid data from the backend server.',
          );
        }

        const resJson: APIRoadmapResponse = await response.json();

        if (resJson && resJson.success && resJson.data) {
          const { project, modules } = resJson.data;

          if (project) {
            setProjectDetails({
              title: project.title,
              description: project.description,
              progressPercentage: project.progressPercentage,
            });
          }

          if (Array.isArray(modules)) {
            const formattedRoadmap: CategoryGroup[] = modules.map(
              (module: RawModuleFromAPI): CategoryGroup => ({
                category: (module?.title || '').toUpperCase(),
                tasks: Array.isArray(module?.tasks)
                  ? module.tasks.map((task: RawTaskFromAPI): Task => {
                      let assignedStatus: 'completed' | 'current' | 'locked' =
                        'locked';

                      if (
                        task?.status === 'completed' ||
                        task?.status === 'passed'
                      ) {
                        assignedStatus = 'completed';
                      } else if (
                        task?.status === 'current' ||
                        task?.status === 'unlocked'
                      ) {
                        assignedStatus = 'current';
                      }

                      return {
                        id: task?._id || task?.id || '',
                        title: task?.title || '',
                        status: assignedStatus,
                      };
                    })
                  : [],
              }),
            );

            setRoadmapData(formattedRoadmap);

            if (
              formattedRoadmap.length > 0 &&
              formattedRoadmap[0].tasks.length > 0 &&
              !activeTaskId
            ) {
              setActiveTaskId(formattedRoadmap[0].tasks[0].id);
            }
          }
        } else {
          throw new Error(resJson.message || 'Invalid API data structure.');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred during data synchronization.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceData();
    // activeTaskId is safely omitted to prevent unnecessary API re-fetches when switching tasks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // FLOW 2: Fetch detailed content for a specific task (Triggers when activeTaskId changes)
  useEffect(() => {
    if (!activeTaskId) return;

    const fetchTaskDetails = async () => {
      try {
        setLoadingTask(true);
        const response = await fetch(`/api/task/${activeTaskId}`);
        const resJson: APITaskDetailsResponse = await response.json();

        if (resJson && resJson.success && resJson.data) {
          setTaskDetails({
            _id: resJson.data._id || resJson.data.id || '',
            title: resJson.data.title || '',
            description: resJson.data.description,
          });
        } else {
          setTaskDetails(null);
        }
      } catch {
        // Safely caught block without unused variables to satisfy ESLint rules
        setTaskDetails(null);
      } finally {
        setLoadingTask(false);
      }
    };

    fetchTaskDetails();
  }, [activeTaskId]);

  const currentProjectName = projectDetails?.title || 'Loading project...';
  const currentProgress = projectDetails?.progressPercentage ?? 0;

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
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex w-76 flex-shrink-0 border-r border-primary-soft bg-primary-mid/10 bg-card flex-col justify-between overflow-y-auto">
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

        {/* RIGHT SIDEBAR */}
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

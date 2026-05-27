import { useState, useEffect } from 'react';
import { Header } from '../../components/ui/Header';

interface Task {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'locked';
}

interface CategoryGroup {
  category: string;
  tasks: Task[];
}

interface ProjectData {
  projectName: string;
  progressPercentage: number;
  academyData: CategoryGroup[];
}

export default function Roadmaplayout() {
  const [activeTaskId, setActiveTaskId] = useState<string>('init-vite');

  /* -------------------------------------------------------------
     MOCK DATA matching your screenshot setup
     ------------------------------------------------------------- */
  const [projectData] = useState<ProjectData | null>({
    projectName: 'Build a REST API from scratch',
    progressPercentage: 11,
    academyData: [
      {
        category: 'SETUP & FOUNDATIONS',
        tasks: [
          {
            id: 'init-vite',
            title: 'Initialize the Vite project',
            status: 'completed',
          },
          {
            id: 'add-tailwind',
            title: 'Add Tailwind CSS',
            status: 'completed',
          },
          { id: 'setup-routing', title: 'Set up routing', status: 'current' },
        ],
      },
      {
        category: 'AUTH & USER ACCOUNTS',
        tasks: [
          {
            id: 'signup-form',
            title: 'Build the sign-up form',
            status: 'locked',
          },
          {
            id: 'hash-passwords',
            title: 'Hash passwords on the server',
            status: 'locked',
          },
          { id: 'issue-jwt', title: 'Issue a JWT on login', status: 'locked' },
          {
            id: 'protect-routes',
            title: 'Protect routes with middleware',
            status: 'locked',
          },
        ],
      },
      {
        category: 'TWEETS & THE FEED',
        tasks: [
          {
            id: 'tweets-table',
            title: 'Design the tweets table',
            status: 'locked',
          },
          {
            id: 'post-endpoint',
            title: 'POST /tweets endpoint',
            status: 'locked',
          },
          { id: 'get-endpoint', title: 'GET /feed endpoint', status: 'locked' },
          {
            id: 'render-feed',
            title: 'Render the feed in React',
            status: 'locked',
          },
        ],
      },
    ],
  });

  const [loading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    /* Fetch logic placeholder for future production integration */
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-bg justify-center items-center font-sans text-fg-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p>Loading roadmap structure...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-bg justify-center items-center font-sans text-red-500">
        <p className="font-semibold">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentProjectName =
    projectData?.projectName || 'Build a REST API from scratch';
  const currentProgress = projectData?.progressPercentage ?? 0;
  const currentAcademyData = projectData?.academyData || [];

  return (
    <div className="flex flex-col h-screen bg-bg font-sans select-none overflow-hidden text-fg">
      {/* 1. TOP HEADER */}
      <Header />

      {/* 2. LOWER BODY CONTAINER */}
      <div className="flex flex-1 overflow-hidden w-full">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="hidden lg:flex w-76 flex-shrink-0 border-r border-primary-soft bg-primary-mid/10 bg-card flex-col justify-between overflow-y-auto">
          <div>
            <div className="p-4 pt-5 pb-3 flex items-center justify-between border-b border-slate-50">
              <div>
                <span className="text-[10px] font-bold text-fg-muted tracking-widest uppercase block mb-0.5">
                  PROJECT
                </span>
                <h2 className="text-[15px] font-bold text-fg tracking-tight">
                  {currentProjectName}
                </h2>
              </div>
              <button className="text-fg hover:bg-slate-50 p-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors cursor-pointer">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                  <path d="M16 15l-3-3 3-3" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-5">
              <div className="flex bg-white border border-primary-soft p-1 rounded-2xl text-sm font-medium shadow-sm">
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white py-2 px-3 rounded-xl shadow-sm font-semibold cursor-pointer">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Roadmap
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 text-fg-muted py-2 px-3 rounded-xl hover:text-fg hover:bg-slate-50 transition-all cursor-pointer">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                  Explorer
                </button>
              </div>

              <p className="text-[12px] text-fg-muted leading-relaxed px-1">
                Structured path — complete tasks to unlock the next module.
              </p>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center mb-1.5 px-1">
                  <span className="text-[13px] text-fg-muted">Project</span>
                  <span className="text-[13px] font-bold text-fg">
                    {currentProgress}%
                  </span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                  <div
                    className="bg-purple h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${currentProgress}%` }}
                  ></div>
                </div>
              </div>

              <nav className="space-y-5 pt-2">
                {currentAcademyData.map((group) => (
                  <div key={group.category}>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <span className="w-2 h-2 rounded-full bg-primary-mid block"></span>
                      <h3 className="text-[11px] font-bold text-fg-muted tracking-wider uppercase">
                        {group.category}
                      </h3>
                    </div>

                    <ul className="space-y-1">
                      {group.tasks.map((task) => {
                        const isSelected = activeTaskId === task.id;
                        return (
                          <li key={task.id}>
                            <button
                              disabled={task.status === 'locked'}
                              onClick={() => setActiveTaskId(task.id)}
                              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-[13px] font-medium
                                ${
                                  isSelected
                                    ? 'bg-primary-soft text-fg font-semibold shadow-inner border border-primary-mid/30 cursor-default'
                                    : task.status === 'locked'
                                      ? 'text-slate-300 opacity-40 cursor-not-allowed' // Keeps custom lock colors and drops transparency
                                      : 'text-fg hover:bg-primary/20 cursor-pointer' // Uses high contrast solid text-fg for open tasks
                                }`}
                            >
                              {task.status === 'completed' && (
                                <span className="text-success text-sm font-bold flex-shrink-0">
                                  ✓
                                </span>
                              )}
                              {task.status === 'current' && (
                                <span className="w-4 h-4 rounded-full border-2 border-slate-400 block flex-shrink-0"></span>
                              )}
                              {task.status === 'locked' && (
                                <span className="text-slate-300 text-xs flex-shrink-0">
                                  🔒
                                </span>
                              )}
                              <span className="truncate">{task.title}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* ================= MIDDLE MAIN CONTENT ================= */}
        <main className="flex-1 bg-bg p-4 sm:p-8 overflow-y-auto border-r border-slate-100">
          <div className="max-w-3xl mx-auto w-full">
            {/* Main execution route */}
          </div>
        </main>

        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="hidden xl:flex w-80 flex-shrink-0 bg-card border-l border-slate-100 flex-col justify-between overflow-hidden">
          {/* Chat module placeholder */}
        </aside>
      </div>
    </div>
  );
}

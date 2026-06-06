import { useState } from 'react';
import { Header } from '../../../components/ui/Header';
import { PageContainer } from '../../../components/ui/PageContainer';
import { useAuthStore } from '../../auth/stores/authStore';
import { ContinueLearningCard } from './ContinueLearningCard';
import { ProjectCard } from './ProjectCard';
import { WeeklyStreakCard } from './WeeklyStreakCard';
import type {
  DashboardProject,
  FilterCategory,
  WeekDayData,
} from '../types/dashboardTypes';

// Mock data
const MOCK_PROJECTS: DashboardProject[] = [
  {
    id: 'twitter-clone',
    title: 'Build a Twitter Clone',
    description: 'A real social feed, from empty folder to deployed app.',
    category: 'FULLSTACK',
    difficulty: 'INTERMEDIATE',
    estimatedHours: 14,
    completedTasks: 2,
    totalTasks: 18,
  },
  {
    id: 'todo-app',
    title: 'A Todo App, but real',
    description:
      'Master React state by building the most-built app — properly.',
    category: 'FRONTEND',
    difficulty: 'BEGINNER',
    estimatedHours: 4,
    completedTasks: 2,
    totalTasks: 7,
  },
  {
    id: 'rest-api',
    title: 'Build a REST API from scratch',
    description:
      'Backend fundamentals: routes, validation, auth, and a real database.',
    category: 'BACKEND',
    difficulty: 'INTERMEDIATE',
    estimatedHours: 8,
    completedTasks: 2,
    totalTasks: 18,
  },
  {
    id: 'realtime-chat',
    title: 'Realtime Chat App',
    description: 'WebSockets, presence, and persistent conversations.',
    category: 'FULLSTACK',
    difficulty: 'ADVANCED',
    estimatedHours: 18,
    completedTasks: 2,
    totalTasks: 18,
  },
];

const MOCK_CONTINUE = {
  id: 'twitter-clone',
  title: 'Build a Twitter Clone',
  moduleName: 'Module 1 — Setup & Foundations',
  moduleHint: 'One task to go before unlocking auth.',
  progressPercent: 11,
  thumbnailEmoji: '🐦',
};

const MOCK_WEEK_DAYS: WeekDayData[] = [
  { label: 'M', completed: true },
  { label: 'T', completed: true },
  { label: 'W', completed: true },
  { label: 'T', completed: false },
  { label: 'F', completed: true },
  { label: 'S', completed: true },
  { label: 'S', completed: true },
];

const STREAK_DAYS = 6;

// Filter definitions
const FILTERS: { label: string; value: FilterCategory }[] = [
  { label: 'All projects', value: 'ALL' },
  { label: 'Frontend', value: 'FRONTEND' },
  { label: 'Backend', value: 'BACKEND' },
  { label: 'Fullstack', value: 'FULLSTACK' },
];

// Page
export default function DashboardPage() {
  const username = useAuthStore((state) => state.user?.username ?? 'there');
  const firstName = username.split(' ')[0];

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');

  const filteredProjects =
    activeFilter === 'ALL'
      ? MOCK_PROJECTS
      : MOCK_PROJECTS.filter((p) => p.category === activeFilter);

  const completedDays = MOCK_WEEK_DAYS.filter((d) => d.completed).length;

  return (
    <PageContainer>
      <Header />

      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
          {/* Welcome row */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-fg-muted mb-1">Welcome back</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-fg">
                Hey {firstName} — ready to build?
              </h1>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold select-none">
              🔥 {STREAK_DAYS}-day streak
            </span>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Left column ── */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Continue learning */}
              <ContinueLearningCard data={MOCK_CONTINUE} />

              {/* Filter chips */}
              <div
                role="group"
                aria-label="Filter projects by category"
                className="flex flex-wrap gap-2"
              >
                {FILTERS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setActiveFilter(value)}
                    aria-pressed={activeFilter === value}
                    className={[
                      'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                      activeFilter === value
                        ? 'bg-primary text-white'
                        : 'bg-white border border-slate-200 text-fg-muted hover:border-primary-mid hover:text-primary cursor-pointer',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Project library */}
              <section aria-label="Project library">
                <h2 className="text-xl font-bold text-fg mb-4">
                  Project library
                </h2>

                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <p className="py-12 text-center text-sm text-fg-muted">
                    No projects in this category yet.
                  </p>
                )}
              </section>
            </div>

            {/* ── Right sidebar ── */}
            <aside
              className="w-full lg:w-72 xl:w-80 shrink-0"
              aria-label="Weekly activity"
            >
              <WeeklyStreakCard
                days={MOCK_WEEK_DAYS}
                completedDays={completedDays}
                totalDays={7}
                message="Small daily wins compound. You're doing great."
              />
            </aside>
          </div>
        </div>
      </main>
    </PageContainer>
  );
}

import { useState } from 'react';
import { Header } from '../../../components/ui/Header';
import { PageContainer } from '../../../components/ui/PageContainer';
import { useAuthStore } from '../../auth/stores/authStore';
import { ContinueLearningCard } from './ContinueLearningCard';
import { ProjectCard } from './ProjectCard';
import { WeeklyStreakCard } from './WeeklyStreakCard';
import { useDashboardData } from '../hooks/useDashboardData';
import type { FilterCategory } from '../types/dashboardTypes';
import { Button } from '../../../components/ui/Button';
import { ArrowDown } from 'lucide-react';
const FILTERS: { label: string; value: FilterCategory }[] = [
  { label: 'All projects', value: 'ALL' },
  { label: 'Frontend', value: 'FRONTEND' },
  { label: 'Backend', value: 'BACKEND' },
  { label: 'Fullstack', value: 'FULLSTACK' },
];
const CardPlaceholder = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`border border-primary-mid/40 rounded-2xl p-6 flex items-center justify-center ${className}`}
  >
    {children}
  </div>
);

export default function DashboardPage() {
  const username = useAuthStore((state) => state.user?.username ?? 'there');
  const firstName = username.split(' ')[0];

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const {
    continueData,
    projects,
    streakData,
    isLoadingProgress,
    isLoadingProjects,
    isLoadingStreak,
    error,
  } = useDashboardData();

  const filteredProjects =
    activeFilter === 'ALL'
      ? projects
      : projects.filter((p) => (p.category || 'FULLSTACK') === activeFilter);

  return (
    <PageContainer>
      <Header />

      <main className="flex-1 w-full">
        <div className="px-8 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-fg-muted mb-1">Welcome back</p>
              <h2 className="text-3xl font-semibold text-fg">
                Hey {firstName} — ready to build?
              </h2>
            </div>
          </div>
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {/* Row 1: Continue Learning + Streak */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mb-6 items-start">
            {isLoadingProgress ? (
              <CardPlaceholder className="h-full bg-primary-soft">
                <p className="text-fg-muted">Is loading...</p>
              </CardPlaceholder>
            ) : continueData ? (
              <ContinueLearningCard data={continueData} />
            ) : (
              <CardPlaceholder className="h-full bg-primary-soft">
                <p className="text-sm text-slate-600 font-medium flex items-center gap-2">
                  Your coding progress will be tracked here. Select a project
                  below to start
                  <ArrowDown className="w-4 h-4 animate-bounce text-slate-500 flex-shrink-0" />
                </p>
              </CardPlaceholder>
            )}
            {isLoadingStreak ? (
              <CardPlaceholder className="w-full h-[180px] bg-white">
                <p className="text-fg-muted text-sm">Loading streak...</p>
              </CardPlaceholder>
            ) : streakData ? (
              <WeeklyStreakCard
                days={streakData.weekDays}
                completedDays={streakData.completedDays}
                totalDays={streakData.totalDays}
                message={streakData.message}
              />
            ) : (
              <CardPlaceholder className="w-full h-[180px] bg-white">
                <p className="text-fg-muted text-sm">
                  No streak data available
                </p>
              </CardPlaceholder>
            )}
          </div>

          {/* Row 2: Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {FILTERS.map(({ label, value }) => {
              const isActive = activeFilter === value;
              return (
                <Button
                  key={value}
                  onClick={() => setActiveFilter(value)}
                  variant={isActive ? 'primary' : 'outline'}
                  className={`!w-auto !rounded-full px-5 !py-2 text-sm ${
                    !isActive
                      ? 'bg-white text-gray-600 hover:border-primary hover:text-primary hover:!bg-white'
                      : ''
                  }`}
                >
                  {label}
                </Button>
              );
            })}
          </div>

          {/* Row 3: Project Library */}
          <section>
            <h2 className="text-xl font-semibold text-fg mb-4">
              Project library
            </h2>
            {isLoadingProjects ? (
              <p className="py-12 text-center text-sm text-fg-muted">
                is loading
              </p>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-fg-muted">
                No projects available.
              </p>
            )}
          </section>
        </div>
      </main>
    </PageContainer>
  );
}

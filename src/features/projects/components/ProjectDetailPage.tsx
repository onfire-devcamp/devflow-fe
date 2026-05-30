import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Header } from '../../../components/ui/Header';
import { PageContainer } from '../../../components/ui/PageContainer';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  CategoryBadge,
  DifficultyBadge,
  DurationBadge,
  ModulesBadge,
} from '../../../components/ui/Badge';
import { useProjectDetail } from '../hooks/useProjectDetail';
import type { DifficultyLevel, ProjectCategory } from '../types/projectTypes';
import { ProjectDetailTabs } from './tabs';

function ProjectSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading project details"
    >
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-32 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
        <Skeleton className="h-7 w-28 rounded-full" />
      </div>
      <Skeleton className="h-10 w-2/3 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full max-w-2xl rounded" />
        <Skeleton className="h-4 w-4/5 max-w-xl rounded" />
      </div>
      <div className="flex gap-6 border-b border-slate-200 pb-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-5 w-24 rounded" />
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  );
}

function ProjectHero({
  category,
  difficulty,
  estimatedHours,
  moduleCount,
  title,
  description,
}: {
  category: ProjectCategory;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  moduleCount: number;
  title: string;
  description: string;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <CategoryBadge category={category} />
        <DifficultyBadge level={difficulty} />
        <DurationBadge hours={estimatedHours} />
        <ModulesBadge count={moduleCount} />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-fg leading-tight mb-3">
        {title}
      </h1>
      <p className="text-base text-fg-muted max-w-2xl leading-relaxed mb-8">
        {description}
      </p>
    </>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { project, isLoading, error } = useProjectDetail(id);

  return (
    <PageContainer>
      <Header />

      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-28">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft
              className="w-4 h-4"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            All projects
          </Link>

          {isLoading && <ProjectSkeleton />}

          {!isLoading && error && (
            <p className="py-20 text-center text-fg-muted" role="alert">
              {error}
            </p>
          )}

          {!isLoading && project && (
            <>
              <ProjectHero
                category={project.category}
                difficulty={project.difficulty}
                estimatedHours={project.estimatedHours}
                moduleCount={project.moduleCount}
                title={project.title}
                description={project.description}
              />
              <ProjectDetailTabs project={project} />
            </>
          )}
        </div>
      </main>

      {!isLoading && project && (
        <Link
          to={`/workspace/${id}`}
          aria-label={`Start building ${project.title}`}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Start building
          <ArrowRight
            className="w-4 h-4"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </Link>
      )}
    </PageContainer>
  );
}

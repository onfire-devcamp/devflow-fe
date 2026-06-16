import { BookOpen, Clock, Layers, Signal } from 'lucide-react';
import type {
  DifficultyLevel,
  ProjectCategory,
} from '../../features/projects/types/projectTypes';

interface CategoryBadgeProps {
  category: ProjectCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-primary-soft text-primary border border-primary-mid">
      <Layers className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
      {category}
    </span>
  );
}

const difficultyConfig: Record<
  DifficultyLevel,
  { label: string; className: string }
> = {
  BEGINNER: {
    label: 'Beginner',
    className: 'bg-teal-50 text-teal-600 border border-teal-200',
  },
  INTERMEDIATE: {
    label: 'Intermediate',
    className: 'bg-amber-50 text-amber-600 border border-amber-200',
  },
  ADVANCED: {
    label: 'Advanced',
    className: 'bg-primary-soft text-primary border border-primary-mid',
  },
};

interface DifficultyBadgeProps {
  level: DifficultyLevel;
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const config = difficultyConfig[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${config.className}`}
    >
      <Signal className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
      {config.label}
    </span>
  );
}

interface DurationBadgeProps {
  hours: number;
}

export function DurationBadge({ hours }: DurationBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-fg-muted bg-slate-50 border border-slate-200">
      <Clock className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
      {hours}h
    </span>
  );
}

interface ModulesBadgeProps {
  count: number;
}

export function ModulesBadge({ count }: ModulesBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-fg-muted bg-slate-50 border border-slate-200">
      <BookOpen className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
      {count} {count === 1 ? 'module' : 'modules'}
    </span>
  );
}

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { CategoryGroup } from '../../roadmap/RoadmapType';

interface ScorecardModuleBreakdownProps {
  roadmapData: CategoryGroup[];
  showModules: boolean;
  expandedModules: Record<number, boolean>;
  toggleModule: (index: number) => void;
}

export const ScorecardModuleBreakdown: React.FC<
  ScorecardModuleBreakdownProps
> = ({ roadmapData, showModules, expandedModules, toggleModule }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">
        Module Breakdown
      </h3>
      {roadmapData.map((mod, index) => {
        const isExpanded = expandedModules[index] ?? true; // Default expanded
        const moduleScoreTotal = mod.tasks.reduce(
          (sum, task) => sum + (task.aiScore || 0),
          0,
        );
        const moduleTasksWithScore = mod.tasks.filter(
          (t) => t.aiScore !== undefined,
        ).length;
        const moduleAvg =
          moduleTasksWithScore > 0
            ? (moduleScoreTotal / moduleTasksWithScore).toFixed(1)
            : '0.0';

        return (
          <div
            key={index}
            style={{
              transitionDelay: showModules ? `${index * 150}ms` : '0ms',
            }}
            className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-primary hover:ring-1 hover:ring-primary/30 transition-all duration-700 transform ${showModules ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Button
              variant="ghost"
              onClick={() => toggleModule(index)}
              className="!w-full !flex !items-center !justify-between !p-4 !bg-slate-50/50 hover:!bg-slate-50 !transition-colors !cursor-pointer !rounded-none !h-auto"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {index + 1}
                </div>
                <span className="font-semibold text-slate-700 text-left">
                  {mod.category}
                </span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm whitespace-nowrap shrink-0 min-w-max">
                  {moduleAvg}&nbsp;/&nbsp;10
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </div>
            </Button>

            <div
              className={`grid transition-all duration-500 ease-in-out ${
                isExpanded
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-slate-100 p-2">
                  <ul className="space-y-1">
                    {mod.tasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex flex-nowrap items-center justify-between px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors gap-4"
                      >
                        <span className="text-sm text-slate-600 font-medium line-clamp-2">
                          {task.title}
                        </span>
                        <span className="text-sm font-bold text-slate-800 whitespace-nowrap shrink-0 min-w-max text-right">
                          {task.aiScore !== undefined ? (
                            <>{task.aiScore}&nbsp;/&nbsp;10</>
                          ) : (
                            <>-&nbsp;/&nbsp;10</>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

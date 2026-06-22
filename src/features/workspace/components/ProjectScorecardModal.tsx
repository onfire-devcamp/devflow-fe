import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ScorecardModuleBreakdown } from './ScorecardModuleBreakdown';
import { ScorecardActionsPanel } from './ScorecardActionsPanel';
import type { CategoryGroup } from '../../roadmap/RoadmapType';

interface ProjectScorecardModalProps {
  projectTitle: string;
  projectSlug: string;
  projectId: string;
  roadmapData: CategoryGroup[];
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectScorecardModal: React.FC<ProjectScorecardModalProps> = ({
  projectTitle,
  projectSlug,
  projectId,
  roadmapData,
  isOpen,
  onClose,
}) => {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showModules, setShowModules] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >({});

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const t1 = setTimeout(() => setShowScore(true), 100);
    const t2 = setTimeout(() => setShowModules(true), 600);
    const t3 = setTimeout(
      () => setShowFooter(true),
      600 + roadmapData.length * 150 + 400,
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, roadmapData.length]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Calculate Average Score
  let totalScore = 0;
  let totalTasksWithScore = 0;

  roadmapData.forEach((group) => {
    group.tasks.forEach((task) => {
      if (task.aiScore !== undefined) {
        totalScore += task.aiScore;
        totalTasksWithScore++;
      }
    });
  });

  const avgScore =
    totalTasksWithScore > 0
      ? (totalScore / totalTasksWithScore).toFixed(1)
      : '0.0';

  useEffect(() => {
    if (!showScore) return;
    const targetScore = parseFloat(avgScore);
    if (isNaN(targetScore) || targetScore === 0) {
      const t = setTimeout(() => setDisplayedScore(0), 0);
      return () => clearTimeout(t);
    }
    const duration = 1000;
    const steps = 30;
    const interval = duration / steps;
    const increment = targetScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setDisplayedScore(targetScore);
        clearInterval(timer);
      } else {
        setDisplayedScore(current);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [showScore, avgScore]);

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-default"
    >
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800">
            Project Scorecard
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="!p-2 !text-slate-400 hover:!bg-slate-100 hover:!text-slate-600 !rounded-lg !transition-colors !cursor-pointer"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-8 bg-slate-50">
          {/* Main Scorecard to be screenshotted */}
          <div
            id="summary-scorecard-content"
            className="w-full md:flex-1 h-max bg-white border border-primary/20 rounded-3xl p-8 shadow-sm flex flex-col"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                {projectTitle}
              </h1>
              <p className="text-primary mt-2 font-medium">
                Final Evaluation Report
              </p>
            </div>

            {/* Overall Score */}
            <div
              className={`transition-all duration-700 transform ${showScore ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-800 text-center mb-8 mx-auto w-full max-w-sm hover:border-primary hover:ring-2 hover:ring-primary/20 cursor-default`}
            >
              <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                Overall Score
              </div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-extrabold tracking-tight text-primary">
                  {displayedScore.toFixed(1)}
                </span>
                <span className="text-2xl font-medium text-slate-400">
                  / 10
                </span>
              </div>
            </div>

            <ScorecardModuleBreakdown
              roadmapData={roadmapData}
              showModules={showModules}
              expandedModules={expandedModules}
              toggleModule={toggleModule}
            />

            <div
              className={`transition-all duration-700 transform ${showFooter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mt-8 text-center text-sm font-bold text-slate-400 pt-6 border-t border-slate-100`}
            >
              DevFlow - Personalized Learning Platform
            </div>
          </div>

          <ScorecardActionsPanel
            projectTitle={projectTitle}
            projectSlug={projectSlug}
            projectId={projectId}
          />
        </div>
      </div>
    </div>
  );
};

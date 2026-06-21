import React, { useState, useEffect } from 'react';
import { Download, Share2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { workspaceApi } from '../api/workspaceApi';
import {
  exportWorkspaceToZip,
  downloadSummaryScreenshot,
} from '../../../utils/exportUtils';
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
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >({});
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showModules, setShowModules] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [displayedScore, setDisplayedScore] = useState(0);

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

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDownloadSourceCode = async () => {
    if (!projectId || !projectSlug) return;
    setIsExportingZip(true);
    try {
      const response = await workspaceApi.fetchUserWorkspaceFiles(projectId);
      if (response.success && response.data) {
        const files = response.data.map((f) => ({
          path: f.fileId.path,
          content: f.content,
        }));
        await exportWorkspaceToZip(files, projectSlug);
      }
    } catch (err) {
      console.error('Failed to export ZIP', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  const shareUrl = window.location.origin + `/project/${projectSlug}`;

  const shareOptions = [
    {
      name: 'Save to Device',
      action: () => {
        downloadSummaryScreenshot('summary-scorecard-content', projectSlug);
        setShowShareMenu(false);
      },
    },
    {
      name: 'Share via Email',
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(
          `Check out my completed project: ${projectTitle}`,
        )}&body=${encodeURIComponent(
          `I just finished ${projectTitle} on DevFlow!\n\n${shareUrl}`,
        )}`;
        setShowShareMenu(false);
      },
    },
    {
      name: 'Share on Facebook',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank',
        );
        setShowShareMenu(false);
      },
    },
    {
      name: 'Share on Instagram',
      action: () => {
        navigator.clipboard.writeText(
          `I just finished ${projectTitle} on DevFlow! Check it out: ${shareUrl}`,
        );
        alert('Link copied to clipboard for Instagram!');
        setShowShareMenu(false);
      },
    },
  ];

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

            {/* Module Breakdown */}
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
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-slate-700 text-left">
                          {mod.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                          {moduleAvg} / 10
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
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
                                className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                              >
                                <span className="text-sm text-slate-600 font-medium">
                                  {task.title}
                                </span>
                                <span className="text-sm font-bold text-slate-800">
                                  {task.aiScore !== undefined
                                    ? `${task.aiScore} / 10`
                                    : '- / 10'}
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

            <div
              className={`transition-all duration-700 transform ${showFooter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mt-8 text-center text-sm font-bold text-slate-400 pt-6 border-t border-slate-100`}
            >
              DevFlow - Personalized Learning Platform
            </div>
          </div>

          {/* Actions Panel */}
          <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Actions</h2>

            <div className="relative w-full">
              <Button
                variant="outline"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="!w-full !flex !items-center !justify-center !gap-2 !bg-white !border-2 !border-primary hover:!bg-primary-soft hover:!text-primary hover:!border-primary !text-primary !font-bold !py-3.5 !px-4 !rounded-xl !transition-all !shadow-sm active:!scale-[0.98] !cursor-pointer"
              >
                <Share2 className="w-5 h-5" />
                Share Result
              </Button>
              {showShareMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {shareOptions.map((opt) => (
                    <Button
                      variant="ghost"
                      key={opt.name}
                      onClick={opt.action}
                      className="!w-full !text-left !px-4 !py-3 hover:!bg-slate-50 !text-sm !font-semibold !text-slate-700 !cursor-pointer !border-b last:!border-b-0 !border-slate-100 !justify-start !rounded-none !h-auto"
                    >
                      {opt.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="primary"
              onClick={handleDownloadSourceCode}
              disabled={isExportingZip}
              className="!w-full !flex !items-center !justify-center !gap-2 !bg-primary hover:!bg-primary-hover !text-white !font-bold !py-3.5 !px-4 !rounded-xl !transition-all !shadow-md active:!scale-[0.98] disabled:!opacity-70 disabled:!cursor-not-allowed disabled:active:!scale-100 !cursor-pointer"
            >
              {isExportingZip ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Zipping...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Code (.zip)
                </>
              )}
            </Button>

            {/* Additional info block to fill the sidebar visually */}
            <div className="mt-auto pt-6 text-xs text-slate-500 text-center space-y-2 hidden md:block">
              <p>You've successfully completed all modules.</p>
              <p>Download your source code to showcase on your portfolio!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

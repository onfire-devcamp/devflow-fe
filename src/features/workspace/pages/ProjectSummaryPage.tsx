import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Download, Share2, ArrowLeft } from 'lucide-react';
import { workspaceApi } from '../api/workspaceApi';
import { useWorkspaceData } from '../hooks/useWorkspaceData';
import { Header } from '../../../components/ui/Header';
import { GlobalLoader } from '../../../components/ui/GlobalLoader';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import {
  exportWorkspaceToZip,
  downloadSummaryScreenshot,
} from '../../../utils/exportUtils';

export default function ProjectSummaryPage() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const [isExportingZip, setIsExportingZip] = useState(false);

  const {
    data: slugProjectDetails,
    isLoading: isSlugLoading,
    error: slugError,
  } = useQuery({
    queryKey: ['projectSlug', projectSlug],
    queryFn: () => workspaceApi.fetchProjectBySlug(projectSlug!),
    enabled: !!projectSlug,
  });

  const projectId = slugProjectDetails?.id;

  const { projectDetails, roadmapData, loading, error } =
    useWorkspaceData(projectId);

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

  const handleShareResult = () => {
    if (projectSlug) {
      downloadSummaryScreenshot('summary-scorecard', projectSlug);
    }
  };

  if (isSlugLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-fg">
        <GlobalLoader />
      </div>
    );
  }

  if (slugError || error) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg px-6">
        <ErrorMessage
          message={
            (slugError as Error)?.message || error || 'An error occurred'
          }
        />
      </div>
    );
  }

  if (!projectDetails) {
    return <Navigate to="/404" replace />;
  }

  const isProjectCompleted =
    roadmapData.length > 0 &&
    roadmapData.every((group) =>
      group.tasks.every((task) => task.status === 'completed'),
    );

  if (!loading && roadmapData.length > 0 && !isProjectCompleted) {
    return <Navigate to={`/project/${projectSlug}`} replace />;
  }

  // Calculate XP
  let totalXP = 0;
  const moduleBreakdown = roadmapData.map((group) => {
    const groupXP = group.tasks.reduce(
      (sum, task) => sum + (task.skillPoints || 0),
      0,
    );
    totalXP += groupXP;
    return { title: group.category, xp: groupXP };
  });

  return (
    <div className="flex flex-col h-screen bg-bg text-fg overflow-y-auto">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 animate-fadeIn">
        <Link
          to={`/project/${projectSlug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-fg-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back to Project
        </Link>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Scorecard UI */}
          <div
            id="summary-scorecard"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-xl w-full"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                {projectDetails.title}
              </h1>
              <p className="text-slate-500 mt-2">
                Project Completion Scorecard
              </p>
            </div>

            <div className="bg-indigo-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-indigo-500/20 mb-8 transform hover:scale-[1.02] transition-transform">
              <div className="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-1">
                Total XP Earned
              </div>
              <div className="text-5xl font-extrabold tracking-tight">
                {totalXP} XP
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">
                Module Breakdown
              </h3>
              {moduleBreakdown.map((mod, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-slate-700">
                      {mod.title}
                    </span>
                  </div>
                  <div className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm">
                    {mod.xp} XP
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-sm font-medium text-slate-400">
              Generated by DevFlow Interactive Learning
            </div>
          </div>

          {/* Export Actions Sidebar */}
          <div className="w-full md:w-72 space-y-4 flex-shrink-0 sticky top-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Actions</h2>

            <button
              onClick={handleShareResult}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-indigo-100 hover:border-indigo-500 text-indigo-600 font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <Share2 className="w-5 h-5" />
              Share Result
            </button>

            <button
              onClick={handleDownloadSourceCode}
              disabled={isExportingZip}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isExportingZip ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Zipping...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Source Code (.zip)
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

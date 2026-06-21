import React, { useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { workspaceApi } from '../api/workspaceApi';
import {
  exportWorkspaceToZip,
  downloadSummaryScreenshot,
} from '../../../utils/exportUtils';

interface ScorecardActionsPanelProps {
  projectTitle: string;
  projectSlug: string;
  projectId: string;
}

export const ScorecardActionsPanel: React.FC<ScorecardActionsPanelProps> = ({
  projectTitle,
  projectSlug,
  projectId,
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);

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
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl,
          )}`,
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
  );
};

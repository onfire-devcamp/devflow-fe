import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface EditorStatusBannerProps {
  isReadOnly: boolean;
  displayFileName: string;
  onBack: () => void;
}

export function EditorStatusBanner({
  isReadOnly,
  displayFileName,
  onBack,
}: EditorStatusBannerProps) {
  if (isReadOnly) {
    return (
      <div className="flex items-center space-x-3 text-xs mb-4 bg-primary-soft border border-primary-mid/70 p-2.5 px-4 rounded-xl shadow-2xs animate-fade-in">
        <span className="bg-primary text-card px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase shadow-3xs">
          Read-Only
        </span>
        <span className="font-mono text-fg font-bold">{displayFileName}</span>

        <Button
          variant="ghost"
          onClick={onBack}
          className="ml-auto text-[11px] font-bold flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Active Task File</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="text-xs text-fg-muted mb-4">
      Editing:{' '}
      <span className="font-mono text-primary font-bold bg-primary-soft px-1.5 py-0.5 rounded border border-primary-mid/30">
        {displayFileName}
      </span>
    </div>
  );
}

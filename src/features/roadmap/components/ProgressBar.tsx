import React from 'react';
import { type ProgressBarProps } from '../RoadmapType';

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <>
      <p className="text-[12px] text-fg-muted leading-relaxed px-1">
        Structured path — complete tasks to unlock the next module.
      </p>
      <div className="pt-2 border-t border-slate-100">
        <div className="flex justify-between items-center mb-1.5 px-1">
          <span className="text-[13px] text-fg-muted">Project</span>
          <span className="text-[13px] font-bold text-fg">{progress}%</span>
        </div>
        <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
          <div
            className="bg-purple h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </>
  );
}

import React from 'react';

interface EditorHeaderProps {
  isReadOnly: boolean;
  taskTitle: string;
}

export function EditorHeader({ isReadOnly, taskTitle }: EditorHeaderProps) {
  return (
    <>
      <span className="text-[10px] font-extrabold text-primary tracking-wider uppercase block">
        SETUP & FOUNDATIONS · REAL IDE PLAYGROUND
      </span>
      <h1 className="text-xl font-bold text-fg mt-1">
        {isReadOnly ? 'Browsing Project File' : taskTitle}
      </h1>
      <p className="text-xs text-fg-muted mt-1 mb-4">
        {isReadOnly
          ? 'You are in workspace file preview mode. Ask Devi if you need explanations for this code.'
          : 'Complete the source code configuration below to satisfy the assignment requirements.'}
      </p>
    </>
  );
}

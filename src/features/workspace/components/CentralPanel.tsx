import React from 'react';
import { useCurrentTask } from '../hooks/useCurrentTask';

import { EditorHeader } from './EditorHeader';
import { EditorStatusBanner } from './EditorStatusBanner';
import { MonacoWorkspace } from './MonacoWorkspace';
import { ActionBar } from './ActionBar';

export function CentralPanel() {
  const {
    currentTask,
    isReadOnly,
    displayFileName,
    defaultCode,
    xpRewards,
    setBrowsingFile,
  } = useCurrentTask();

  return (
    <div className="flex-1 h-full bg-bg p-6 flex flex-col overflow-y-auto">
      <EditorHeader
        isReadOnly={isReadOnly}
        taskTitle={currentTask?.title || 'No Active Task'}
      />

      <EditorStatusBanner
        isReadOnly={isReadOnly}
        displayFileName={displayFileName}
        onBack={() => setBrowsingFile(null)}
      />

      <MonacoWorkspace
        displayFileName={displayFileName}
        defaultCode={defaultCode}
        isReadOnly={isReadOnly}
      />

      <ActionBar isReadOnly={isReadOnly} xpRewards={xpRewards} />
    </div>
  );
}

import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoWorkspaceProps {
  displayFileName: string;
  defaultCode: string;
  isReadOnly: boolean;
}

export function MonacoWorkspace({
  displayFileName,
  defaultCode,
  isReadOnly,
}: MonacoWorkspaceProps) {
  const getEditorLanguage = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts'))
      return 'typescript';
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.css')) return 'css';
    return 'javascript';
  };

  return (
    <div className="flex-1 bg-[#1e1e2e] rounded-2xl overflow-hidden border border-primary-mid/60 flex flex-col min-h-[350px] shadow-xs">
      <div className="bg-[#141423] px-4 py-2.5 flex items-center justify-between border-b border-white/5">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          {displayFileName.split('/').pop()}
        </span>
        <div className="w-12" />
      </div>

      <div className="flex-1 pt-2 bg-[#1e1e2e]">
        <Editor
          key={displayFileName}
          height="100%"
          theme="vs-dark"
          language={getEditorLanguage(displayFileName)}
          defaultValue={defaultCode}
          options={{
            readOnly: isReadOnly,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'Fira Code, monospace',
            cursorBlinking: 'smooth',
            lineNumbersMinChars: 3,
          }}
        />
      </div>
    </div>
  );
}

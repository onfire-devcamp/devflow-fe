import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { Pen } from 'lucide-react';
import type { TaskDetailsState } from '../../roadmap/RoadmapType';

interface WorkspaceEditorProps {
  taskDetails: TaskDetailsState | null;
  activeFileId: string | null;
  fileContents: Record<string, string>;
  hasSelection: boolean;
  isEvaluating: boolean;
  isChatting: boolean;
  category?: string;
  onFileSelect: (fileId: string) => void;
  onEditorMount: (editor: editor.IStandaloneCodeEditor) => void;
  onEditorChange: (value: string | undefined) => void;
  onQuickAction: (type: 'explain' | 'hint') => void;
}

export function WorkspaceEditor({
  taskDetails,
  activeFileId,
  fileContents,
  hasSelection,
  isEvaluating,
  isChatting,
  category,
  onFileSelect,
  onEditorMount,
  onEditorChange,
  onQuickAction,
}: WorkspaceEditorProps) {
  if (!taskDetails) return null;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Task Meta Header */}
      <div>
        <span className="text-[11px] font-bold text-purple-500 tracking-wider uppercase block mb-1">
          {category || 'SETUP & FOUNDATIONS'}
        </span>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          {taskDetails.title}
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          {taskDetails.description}
        </p>
      </div>

      {/* Tab bars */}
      {taskDetails.files.length > 0 && (
        <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar">
          {taskDetails.files.map((file) => (
            <button
              key={file._id}
              onClick={() => onFileSelect(file._id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-t-xl border transition-colors ${
                activeFileId === file._id
                  ? 'bg-white border-slate-200 border-b-transparent text-slate-800 shadow-sm z-10 relative top-[1px]'
                  : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Pen
                className={`w-3 h-3 ${
                  activeFileId === file._id ? 'text-pink-500' : 'text-slate-400'
                }`}
              />
              {file.path}
            </button>
          ))}
        </div>
      )}

      {/* Code Editor Window */}
      <div className="w-full rounded-xl rounded-tl-none border border-slate-800 bg-[#1e1e1e] overflow-hidden shadow-md relative z-0">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#181818] border-b border-slate-900">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] block" />
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {taskDetails.files.find((f) => f._id === activeFileId)?.path || ''}
          </span>
          <div className="w-10" />
        </div>

        <div className="py-2 bg-[#1e1e1e] relative">
          <Editor
            height="420px"
            theme="vs-dark"
            language={
              taskDetails.files
                .find((f) => f._id === activeFileId)
                ?.path?.endsWith('.json')
                ? 'json'
                : 'typescript'
            }
            value={activeFileId ? fileContents[activeFileId] : ''}
            onMount={onEditorMount}
            onChange={onEditorChange}
          />
          {/* Floating Action Menu */}
          {hasSelection && !isEvaluating && !isChatting && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#2d2d2d] border border-[#444] shadow-lg rounded-xl px-2 py-1.5 flex items-center gap-2 z-10 animate-fadeIn">
              <span className="text-[11px] font-medium text-slate-400 pl-2 pr-1">
                Devi:
              </span>
              <button
                onClick={() => onQuickAction('explain')}
                className="text-[11px] font-semibold px-3 py-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 rounded-lg transition"
              >
                Explain
              </button>
              <button
                onClick={() => onQuickAction('hint')}
                className="text-[11px] font-semibold px-3 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 rounded-lg transition"
              >
                Hint
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

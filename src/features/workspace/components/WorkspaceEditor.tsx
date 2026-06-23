import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Pen, CheckCircle2, Loader2 } from 'lucide-react';
import type { TaskDetailsState } from '../../roadmap/RoadmapType';
import { getLanguageFromPath } from '../utils/languageHelper';
import { Button } from '../../../components/ui/Button';
import { LockedEditorOverlay } from '../../../components/ui/LockedEditorOverlay';
import { ReadOnlyBanner } from '../../../components/ui/ReadOnlyBanner';
import { handleEditorBeforeMount } from '../utils/monacoConfig';
interface WorkspaceEditorProps {
  taskDetails: TaskDetailsState | null;
  activeFileId: string | null;
  fileContents: Record<string, string>;
  hasSelection: boolean;
  isEvaluating: boolean;
  isChatting: boolean;
  isCompleted?: boolean;
  category?: string;
  saveStatus?: 'saved' | 'saving' | 'editing';
  activeFileState?: 'current' | 'completed' | 'locked';
  onFileSelect: (fileId: string) => void;
  onEditorMount: (editor: editor.IStandaloneCodeEditor) => void;
  onEditorChange: (fileId: string, value: string | undefined) => void;
  onQuickAction: (type: 'explain' | 'hint') => void;
  onBackToActiveTask?: () => void;
}

export function WorkspaceEditor({
  taskDetails,
  activeFileId,
  fileContents,
  hasSelection,
  isEvaluating,
  isChatting,
  isCompleted,
  category,
  saveStatus = 'saved',
  activeFileState = 'current',
  onFileSelect,
  onEditorMount,
  onEditorChange,
  onQuickAction,
  onBackToActiveTask,
}: WorkspaceEditorProps) {
  const { projectSlug } = useParams<{ projectSlug: string }>();

  if (!taskDetails) return null;

  const currentTaskFiles = taskDetails.files;
  const isCompletedFile = activeFileState === 'completed';
  const isLockedFile = activeFileState === 'locked';
  const activeFileInTask = currentTaskFiles.find((f) => f._id === activeFileId);

  return (
    <div className="space-y-4 animate-fadeIn">
      <Link
        to={`/project/${projectSlug}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-fg-muted hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
        Project Overview
      </Link>
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

      {/* Tab bars and Hint Banner */}
      <div className="flex items-end justify-between pt-2">
        {currentTaskFiles.length > 0 ? (
          <div className="flex items-center gap-2">
            {currentTaskFiles.map((file) => (
              <Button
                variant="ghost"
                key={file._id}
                onClick={() => onFileSelect(file._id)}
                className={`!w-auto !rounded-none flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-t-xl border transition-colors ${
                  activeFileId === file._id
                    ? 'bg-white border-slate-200 border-b-transparent text-slate-800 shadow-sm z-10 relative top-[1px]'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Pen
                  className={`w-3 h-3 ${
                    activeFileId === file._id
                      ? 'text-pink-500'
                      : 'text-slate-400'
                  }`}
                />
                {file.path}
              </Button>
            ))}
          </div>
        ) : (
          <div />
        )}

        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg whitespace-nowrap mb-1 shadow-sm">
          <span>Highlight code to</span>
          <span className="text-purple-600 font-semibold bg-purple-50 px-1.5 py-0.5 rounded-md border border-purple-100">
            Explain
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-amber-500 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
            Hint
          </span>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {/* Read-Only Banner */}
        {(isCompletedFile || isCompleted) && (
          <ReadOnlyBanner
            message={
              isCompleted
                ? 'You are browsing a file from a completed task.'
                : 'You are browsing a file from a previous task.'
            }
            onBackToTask={() => {
              if (isCompleted && onBackToActiveTask) {
                onBackToActiveTask();
              } else {
                onFileSelect(currentTaskFiles[0]?._id);
              }
            }}
          />
        )}

        <div
          className={`w-full ${isCompletedFile || isCompleted ? 'rounded-b-xl border-t-0' : 'rounded-xl'} border border-slate-800 bg-slate-900 overflow-hidden shadow-md relative z-0`}
        >
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-900">
            <div className="flex items-center gap-1.5 w-32">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
            </div>

            <span className="text-[11px] text-slate-500 font-mono">
              {activeFileInTask?.path ||
                (isCompletedFile
                  ? 'Browsing past file'
                  : isLockedFile
                    ? 'Locked file'
                    : '')}
            </span>
            <div className="w-32 flex justify-end select-none">
              {activeFileState === 'current' && saveStatus === 'saving' && (
                <span className="text-amber-400 flex items-center gap-1.5 text-[10px] font-medium font-mono uppercase tracking-wider animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                </span>
              )}
              {activeFileState === 'current' && saveStatus === 'editing' && (
                <span className="text-slate-400 flex items-center gap-1.5 text-[10px] font-medium font-mono uppercase tracking-wider">
                  <Pen className="w-3 h-3" /> Editing
                </span>
              )}
              {activeFileState === 'current' && saveStatus === 'saved' && (
                <span className="text-emerald-500/90 flex items-center gap-1.5 text-[10px] font-medium font-mono uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" /> Saved
                </span>
              )}
            </div>
          </div>

          <div className="py-2 bg-slate-900 relative">
            {isLockedFile && (
              <LockedEditorOverlay
                onBackToTask={() => onFileSelect(currentTaskFiles[0]?._id)}
              />
            )}
            <div
              className={
                isLockedFile ? 'opacity-50 blur-[2px] pointer-events-none' : ''
              }
            >
              <Editor
                key={activeFileId || 'empty'}
                height="420px"
                theme="vs-dark"
                path={activeFileInTask?.path || 'readonly.ts'}
                language={getLanguageFromPath(
                  activeFileInTask?.path || 'readonly.ts',
                )}
                value={activeFileId ? fileContents[activeFileId] : ''}
                beforeMount={handleEditorBeforeMount}
                onMount={onEditorMount}
                onChange={(value) => {
                  if (activeFileId && activeFileState === 'current') {
                    onEditorChange(activeFileId, value);
                  }
                }}
                options={{
                  readOnly: isCompleted || activeFileState !== 'current',
                }}
              />
            </div>
            {hasSelection &&
              !isEvaluating &&
              !isChatting &&
              activeFileState === 'current' && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-700 shadow-xl rounded-xl px-2.5 py-2 flex items-center gap-2 z-10 animate-fadeIn">
                  <span className="text-[11px] font-medium text-slate-500 pl-1.5 pr-1 select-none">
                    Devi:
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => onQuickAction('explain')}
                    className="!w-auto text-[11px] font-semibold px-3 py-1.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg transition-colors"
                  >
                    Explain
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onQuickAction('hint')}
                    className="!w-auto !text-amber-200 text-[11px] font-semibold px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 rounded-lg transition-colors"
                  >
                    Hint
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

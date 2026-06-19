import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import { Code2 } from 'lucide-react';
import { TabPanel, EmptyPanel } from '.';
import { FileTree } from '../../../../components/ui/FileTree';
import { LockedEditorOverlay } from '../../../../components/ui/LockedEditorOverlay';
import { buildFileTreeFromPaths } from '../../../../utils/fileTreeUtils';
import { getProjectCodebase } from '../../api/projectsApi';
import { workspaceApi } from '../../../workspace/api/workspaceApi';
import type { FileNode } from '../../types/fileTree';
import type { ProjectDetail } from '../../types/projectTypes';
import { getLanguageFromPath } from '../../../workspace/utils/languageHelper';
import { handleEditorBeforeMount } from '../../../workspace/utils/monacoConfig';

export function CodebaseTab({ project }: { project: ProjectDetail }) {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const { data: codebase, isLoading: isCodebaseLoading } = useQuery({
    queryKey: ['projectCodebase', project.slug],
    queryFn: () => getProjectCodebase(project.slug),
    enabled: !!project.slug,
  });

  const { data: roadmapData, isLoading: isRoadmapLoading } = useQuery({
    queryKey: ['projectRoadmap', project.id],
    queryFn: () => workspaceApi.fetchProjectRoadmap(project.id),
    enabled: !!project.id,
  });

  const fileTree = useMemo(() => {
    if (!codebase) return [];

    const module1FileIds = new Set<string>();

    // Extract file IDs from the first module
    if (roadmapData?.data?.modules && roadmapData.data.modules.length > 0) {
      const firstModuleTasks = roadmapData.data.modules[0].tasks || [];
      firstModuleTasks.forEach(
        (
          task: import('../../../roadmap/RoadmapType').RawTaskFromAPI & {
            fileId?: { _id?: string; id?: string }[];
          },
        ) => {
          if (task.fileId && Array.isArray(task.fileId)) {
            task.fileId.forEach((file: { _id?: string; id?: string }) => {
              if (file._id) module1FileIds.add(file._id);
              if (file.id) module1FileIds.add(file.id);
            });
          }
        },
      );
    }

    return buildFileTreeFromPaths(
      codebase.map((file) => ({
        id: file._id,
        path: file.path,
        content: file.content,
        isLocked:
          roadmapData && !file.readOnly ? !module1FileIds.has(file._id) : false,
        readOnly: file.readOnly,
      })),
    );
  }, [codebase, roadmapData]);

  const handleNodeSelect = useCallback((node: FileNode) => {
    if (node.type === 'file') {
      setActiveFileId(node.id);
    }
  }, []);

  const findNodeById = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const activeNode = activeFileId ? findNodeById(fileTree, activeFileId) : null;

  if (isCodebaseLoading || isRoadmapLoading) {
    return (
      <TabPanel tabId="codebase" className="flex justify-center py-16">
        <p className="text-sm text-fg-muted">Loading codebase...</p>
      </TabPanel>
    );
  }

  if (!codebase || codebase.length === 0) {
    return (
      <TabPanel tabId="codebase" className="py-16">
        <EmptyPanel message="Codebase not available yet." />
      </TabPanel>
    );
  }

  return (
    <TabPanel tabId="codebase">
      <div className="flex border-t border-slate-200">
        {/* Left Panel: File Tree */}
        <div className="w-1/3 min-w-[250px] border-r border-slate-200 bg-slate-50 p-4 overflow-y-auto max-h-[600px]">
          <FileTree
            data={fileTree}
            activeFileId={activeFileId}
            onNodeSelect={handleNodeSelect}
          />
        </div>

        {/* Right Panel: Editor or Empty State */}
        <div className="flex-1 bg-slate-900 min-h-[500px]">
          {activeNode ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-900">
                <div className="flex items-center gap-1.5 w-32">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {activeNode.path}
                </span>
                <div className="w-32" />
              </div>
              <div className="flex-1 relative bg-slate-900">
                {activeNode.isLocked && (
                  <LockedEditorOverlay message="Enroll and complete module 1 to unlock this file" />
                )}
                <div
                  className={`absolute inset-0 ${
                    activeNode.isLocked
                      ? 'opacity-50 blur-[2px] pointer-events-none'
                      : ''
                  }`}
                >
                  <Editor
                    key={activeNode.id}
                    height="100%"
                    theme="vs-dark"
                    path={activeNode.path}
                    language={getLanguageFromPath(activeNode.path)}
                    value={activeNode.skeletonCode || activeNode.content || ''}
                    beforeMount={handleEditorBeforeMount}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-500">
              <Code2 className="w-12 h-12 text-slate-600" strokeWidth={1.5} />
              <div className="text-center">
                <p className="text-sm font-medium text-slate-400">
                  Pick any file to peek inside
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Each file ships with a starter skeleton...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </TabPanel>
  );
}

import { memo, useState } from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import type { FileNode } from '../../features/projects/types/fileTree';
import { getFileIcon } from '../../utils/fileIcons';

interface FileTreeProps {
  data: FileNode[];
  onNodeSelect: (node: FileNode) => void;
  activeFileId: string | null;
  className?: string;
}

export function FileTree({
  data,
  onNodeSelect,
  activeFileId,
  className = '',
}: FileTreeProps) {
  return (
    <div className={`text-sm ${className}`}>
      {data.map((node) => (
        <MemoizedFileTreeNode
          key={node.id}
          node={node}
          onNodeSelect={onNodeSelect}
          activeFileId={activeFileId}
          depth={0}
        />
      ))}
    </div>
  );
}

interface FileTreeNodeProps {
  node: FileNode;
  onNodeSelect: (node: FileNode) => void;
  activeFileId: string | null;
  depth: number;
}

function FileTreeNode({
  node,
  onNodeSelect,
  activeFileId,
  depth,
}: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.type === 'folder';
  const isActive = node.id === activeFileId;

  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onNodeSelect(node);
    }
  };

  const getWeightClass = () => {
    if (node.isCurrentTask) return 'font-bold text-fg';
    if (node.isCompleted) return 'font-normal text-fg';
    if (node.isLocked) return 'font-normal text-fg-muted';
    return 'font-normal text-fg';
  };

  return (
    <div>
      <div
        className={`flex items-center py-1.5 px-2 hover:bg-slate-100 cursor-pointer ${
          isActive ? 'bg-slate-200 text-slate-900' : 'text-slate-700'
        } ${getWeightClass()}`}
        style={{ paddingLeft: `${depth * 0.5 + 0.5}rem` }}
        onClick={handleToggle}
      >
        <span className="shrink-0 flex items-center justify-center w-4 h-4">
          {isFolder ? (
            <ChevronRight
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            />
          ) : (
            getFileIcon(node.name)
          )}
        </span>
        <span className="truncate flex-1">{node.name}</span>
        {node.isLocked && !isFolder && (
          <Lock className="w-3 h-3 text-slate-400 shrink-0 ml-2" />
        )}
      </div>

      {isFolder && isOpen && node.children && (
        <div className="flex flex-col ml-3 border-l border-slate-200/60 relative">
          {node.children.map((child) => (
            <div key={child.id} className="relative">
              <MemoizedFileTreeNode
                node={child}
                onNodeSelect={onNodeSelect}
                activeFileId={activeFileId}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const MemoizedFileTreeNode = memo(FileTreeNode, (prevProps, nextProps) => {
  // Always re-render if the core node data or depth changes
  if (prevProps.node !== nextProps.node || prevProps.depth !== nextProps.depth)
    return false;

  // Folders must re-render to pass the new activeFileId down to their children
  if (nextProps.node.type === 'folder') return false;

  // For files, ONLY re-render if it is the file we just left, or the file we just entered
  const wasActive = prevProps.node.id === prevProps.activeFileId;
  const isActive = nextProps.node.id === nextProps.activeFileId;

  return wasActive === isActive;
});

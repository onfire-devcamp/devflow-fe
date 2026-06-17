import { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode2,
  FileJson,
  FileText,
  Lock,
} from 'lucide-react';
import type { FileNode } from '../../features/projects/types/fileTree';

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
        <FileTreeNode
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

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts'))
      return <FileCode2 className="w-4 h-4 text-blue-500" />;
    if (fileName.endsWith('.json'))
      return <FileJson className="w-4 h-4 text-yellow-500" />;
    return <FileText className="w-4 h-4 text-slate-500" />;
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
        className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer rounded-md hover:bg-slate-100/80 transition-colors ${
          isActive && !isFolder
            ? 'bg-primary-soft text-primary font-medium'
            : getWeightClass()
        }`}
        style={{ paddingLeft: `${depth * 1 + 0.5}rem` }}
        onClick={handleToggle}
      >
        <span className="shrink-0 flex items-center justify-center w-4 h-4">
          {isFolder ? (
            isOpen ? (
              <FolderOpen className="w-4 h-4 text-slate-400" />
            ) : (
              <Folder className="w-4 h-4 text-slate-400" />
            )
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
        <div className="flex flex-col">
          {node.children.map((child) => (
            <FileTreeNode
              key={child.id}
              node={child}
              onNodeSelect={onNodeSelect}
              activeFileId={activeFileId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

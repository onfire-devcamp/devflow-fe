export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  skeletonCode?: string;
  isLocked?: boolean;
  isCurrentTask?: boolean;
  isCompleted?: boolean;
}

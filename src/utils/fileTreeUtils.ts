import type { FileNode } from '../features/projects/types/fileTree';

export interface FlatFile {
  id: string;
  path: string;
  content?: string;
  skeletonCode?: string;
  isLocked?: boolean;
  isCurrentTask?: boolean;
  isCompleted?: boolean;
}

export function buildFileTreeFromPaths(flatFiles: FlatFile[]): FileNode[] {
  const rootNodes: FileNode[] = [];

  flatFiles.forEach((file) => {
    const parts = file.path.split('/');
    let currentLevel = rootNodes;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const currentPath = parts.slice(0, index + 1).join('/');

      let existingNode = currentLevel.find((node) => node.name === part);

      if (!existingNode) {
        existingNode = {
          id: isFile ? file.id : `folder-${currentPath}`,
          name: part,
          type: isFile ? 'file' : 'folder',
          path: currentPath,
          ...(isFile
            ? {
                content: file.content,
                skeletonCode: file.skeletonCode ?? file.content,
                isLocked: file.isLocked,
                isCurrentTask: file.isCurrentTask,
                isCompleted: file.isCompleted,
              }
            : { children: [] }),
        };
        currentLevel.push(existingNode);
      }

      if (!isFile && existingNode.children) {
        currentLevel = existingNode.children;
      }
    });
  });

  const sortNodes = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => {
      if (node.children) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(rootNodes);
  return rootNodes;
}

import { FileCode2, FileJson, FileText, FileImage, File } from 'lucide-react';

export const getFileIcon = (fileName: string) => {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith('.tsx') || lowerName.endsWith('.ts')) {
    return <FileCode2 className="w-4 h-4 text-blue-500" />;
  }
  if (lowerName.endsWith('.jsx') || lowerName.endsWith('.js')) {
    return <FileCode2 className="w-4 h-4 text-yellow-400" />;
  }
  if (lowerName.endsWith('.json')) {
    return <FileJson className="w-4 h-4 text-green-500" />;
  }
  if (lowerName.endsWith('.html') || lowerName.endsWith('.css')) {
    return <FileCode2 className="w-4 h-4 text-orange-500" />;
  }
  if (
    lowerName.endsWith('.png') ||
    lowerName.endsWith('.jpg') ||
    lowerName.endsWith('.svg')
  ) {
    return <FileImage className="w-4 h-4 text-purple-400" />;
  }
  if (lowerName.endsWith('.md') || lowerName.endsWith('.txt')) {
    return <FileText className="w-4 h-4 text-slate-400" />;
  }

  return <File className="w-4 h-4 text-slate-500" />;
};

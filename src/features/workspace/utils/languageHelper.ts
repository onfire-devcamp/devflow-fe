export const getLanguageFromPath = (path?: string): string => {
  if (!path) return 'typescript';
  return path.endsWith('.json') ? 'json' : 'typescript';
};

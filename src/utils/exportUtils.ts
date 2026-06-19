import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';

export const exportWorkspaceToZip = async (
  files: { path: string; content: string }[],
  projectName: string,
) => {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.path, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${projectName}-source.zip`);
};

export const downloadSummaryScreenshot = async (
  elementId: string,
  projectName: string,
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    // We add backgroundColor as fallback to ensure transparent nodes get a solid background
    const dataUrl = await toPng(element, {
      cacheBust: true,
      backgroundColor: '#f8fafc',
    });
    const link = document.createElement('a');
    link.download = `${projectName}-score.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to generate screenshot', err);
  }
};

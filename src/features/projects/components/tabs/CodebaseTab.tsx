import { ArrowRight, Code2 } from 'lucide-react';
import { TabPanel, EmptyPanel } from '.';

export function CodebaseTab({ codebaseUrl }: { codebaseUrl?: string }) {
  return (
    <TabPanel
      tabId="codebase"
      className="flex flex-col items-center gap-4 py-16 px-6"
    >
      {codebaseUrl ? (
        <>
          <Code2
            className="w-10 h-10 text-fg-muted"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="text-sm text-fg-muted">
            Explore the starter codebase on GitHub.
          </p>
          <a
            href={codebaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fg text-white text-sm font-medium hover:bg-fg/90 transition-colors"
          >
            Open on GitHub
            <ArrowRight
              className="w-4 h-4"
              strokeWidth={2}
              aria-hidden="true"
            />
          </a>
        </>
      ) : (
        <EmptyPanel message="Codebase link coming soon." />
      )}
    </TabPanel>
  );
}

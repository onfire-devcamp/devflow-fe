import { useRef, useState } from 'react';
import { Code2, Cpu, GitBranch, Monitor, Sparkles } from 'lucide-react';
import { TabButton } from '../../../../components/ui/TabButton';
import type { ProjectDetail } from '../../types/projectTypes';
import { UIPreviewTab } from './UIPreviewTab';
import { FeaturesTab } from './FeaturesTab';
import { TechStackTab } from './TechStackTab';
import { SystemFlowTab } from './SystemFlowTab';
import { CodebaseTab } from './CodebaseTab';

export function TabPanel({
  tabId,
  className = '',
  children,
}: {
  tabId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      id={`panel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      className={`animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
}

export function EmptyPanel({ message }: { message: string }) {
  return <p className="py-16 text-center text-sm text-fg-muted">{message}</p>;
}

const TABS = [
  { id: 'ui-preview' as const, label: 'UI Preview', Icon: Monitor },
  { id: 'features' as const, label: 'Features', Icon: Sparkles },
  { id: 'tech-stack' as const, label: 'Tech Stack', Icon: Cpu },
  { id: 'system-flow' as const, label: 'System Flow', Icon: GitBranch },
  { id: 'codebase' as const, label: 'Codebase', Icon: Code2 },
] as const;

type ActiveTab = (typeof TABS)[number]['id'];

function TabBar({
  activeTab,
  onChange,
}: {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % TABS.length;
    else if (e.key === 'ArrowLeft')
      next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = TABS.length - 1;
    else return;
    e.preventDefault();
    onChange(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Project sections"
      className="flex items-end border-b border-slate-200 overflow-x-auto"
    >
      {TABS.map(({ id, label, Icon }, index) => {
        const isActive = activeTab === id;
        return (
          <TabButton
            key={id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={`tab-${id}`}
            isActive={isActive}
            label={label}
            icon={Icon}
            aria-controls={`panel-${id}`}
            onClick={() => onChange(id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        );
      })}
    </div>
  );
}

export function ProjectDetailTabs({ project }: { project: ProjectDetail }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ui-preview');

  return (
    <>
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
      <div className="rounded-b-2xl border border-t-0 border-slate-200 bg-slate-50 overflow-hidden">
        {activeTab === 'ui-preview' && (
          <UIPreviewTab previewUrl={project.previewUrl} title={project.title} />
        )}
        {activeTab === 'features' && (
          <FeaturesTab features={project.features} />
        )}
        {activeTab === 'tech-stack' && (
          <TechStackTab techStack={project.techStack} />
        )}
        {activeTab === 'system-flow' && (
          <SystemFlowTab
            systemFlowUrl={project.systemFlowUrl}
            title={project.title}
          />
        )}
        {activeTab === 'codebase' && (
          <CodebaseTab codebaseUrl={project.codebaseUrl} />
        )}
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Header } from '../../components/ui/Header';
import { MOCK_PROJECT_DATA } from '../../mocks/RoadmapData';
import { type ProjectData } from './RoadmapType';

import { SidebarHeader } from './components/SideBarHeader';
import { TabSwitcher } from './components/TabSwitcher';
import { ProgressBar } from './components/ProgressBar';
import { TaskList } from './components/TaskList';

export default function RoadmapLayout() {
  const [activeTaskId, setActiveTaskId] = useState<string>('init-vite');
  const [projectData] = useState<ProjectData | null>(MOCK_PROJECT_DATA);
  const loading = false;
  const error = null;
  useEffect(() => {}, []);

  if (loading || error) return null;

  const currentProjectName =
    projectData?.projectName || 'Build a REST API from scratch';
  const currentProgress = projectData?.progressPercentage ?? 0;
  const currentAcademyData = projectData?.academyData || [];

  return (
    <div className="flex flex-col h-screen bg-bg select-none overflow-hidden text-fg">
      <Header />
      <div className="flex flex-1 overflow-hidden w-full">
        {/* TODO: Left sidebar */}
        <aside className="hidden lg:flex w-76 flex-shrink-0 border-r border-primary-soft bg-primary-mid/10 bg-card flex-col justify-between overflow-y-auto">
          <div>
            <SidebarHeader projectName={currentProjectName} />
            <div className="p-4 space-y-5">
              <TabSwitcher />
              <ProgressBar progress={currentProgress} />
              <TaskList
                academyData={currentAcademyData}
                activeTaskId={activeTaskId}
                onTaskSelect={setActiveTaskId}
              />
            </div>
          </div>
        </aside>

        {/* TODO: Middle main content */}
        <main className="flex-1 bg-bg p-4 sm:p-8 border-r border-slate-100 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full min-h-[500px] rounded-2xl border border-dashed border-slate-200 bg-slate-50/30"></div>
        </main>

        {/* TODO: Right sidebar */}
        <aside className="hidden xl:flex w-80 flex-shrink-0 bg-card border-l border-slate-100 flex-col justify-between overflow-hidden"></aside>
      </div>
    </div>
  );
}

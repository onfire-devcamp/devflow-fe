import { RoadmapIconButton } from './RoadmapButtons';
import { SidebarToggleIcon } from './RoadmapIcons';

interface SidebarHeaderProps {
  projectName: string;
  onToggleSidebar: () => void;
}

export function SidebarHeader({
  projectName,
  onToggleSidebar,
}: SidebarHeaderProps) {
  return (
    <div className="p-4 pt-5 pb-3 flex items-center justify-between border-b border-slate-50">
      <div>
        <span className="text-[10px] font-bold text-fg-muted tracking-widest uppercase block mb-0.5">
          PROJECT
        </span>
        <h2 className="text-[15px] font-bold text-fg tracking-tight">
          {projectName}
        </h2>
      </div>

      <RoadmapIconButton aria-label="Toggle Sidebar" onClick={onToggleSidebar}>
        <SidebarToggleIcon className="w-4 h-4" />
      </RoadmapIconButton>
    </div>
  );
}

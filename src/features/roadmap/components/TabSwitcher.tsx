import { RoadmapTabButton } from './RoadmapButtons';
import { RoadmapBookIcon, ExplorerCompassIcon } from './RoadmapIcons';

export function TabSwitcher({
  activeTab,
  onChange,
}: {
  activeTab: 'roadmap' | 'explorer';
  onChange: (tab: 'roadmap' | 'explorer') => void;
}) {
  return (
    <div className="flex bg-white border border-primary-soft p-1 rounded-2xl text-sm font-medium shadow-sm">
      <RoadmapTabButton
        active={activeTab === 'roadmap'}
        onClick={() => onChange('roadmap')}
      >
        <RoadmapBookIcon className="w-4 h-4" />
        Roadmap
      </RoadmapTabButton>

      <RoadmapTabButton
        active={activeTab === 'explorer'}
        onClick={() => onChange('explorer')}
      >
        <ExplorerCompassIcon className="w-4 h-4" />
        Explorer
      </RoadmapTabButton>
    </div>
  );
}

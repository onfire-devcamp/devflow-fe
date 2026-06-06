import { RoadmapTabButton } from './RoadmapButtons';
import { RoadmapBookIcon, ExplorerCompassIcon } from './RoadmapIcons';

export function TabSwitcher() {
  return (
    <div className="flex bg-white border border-primary-soft p-1 rounded-2xl text-sm font-medium shadow-sm">
      <RoadmapTabButton active>
        <RoadmapBookIcon className="w-4 h-4" />
        Roadmap
      </RoadmapTabButton>

      <RoadmapTabButton>
        <ExplorerCompassIcon className="w-4 h-4" />
        Explorer
      </RoadmapTabButton>
    </div>
  );
}

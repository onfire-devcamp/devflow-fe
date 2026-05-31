import { RoadmapTaskItemButton } from './RoadmapButtons';
import {
  RoadmapCompletedIcon,
  RoadmapCurrentIcon,
  RoadmapLockedIcon,
} from './RoadmapIcons';
import { type TaskListProps } from '../RoadmapType';

export function TaskList({
  academyData,
  activeTaskId,
  onTaskSelect,
}: TaskListProps) {
  return (
    <nav className="space-y-5 pt-2">
      {academyData.map((group) => (
        <div key={group.category}>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="w-2 h-2 rounded-full bg-primary-mid block"></span>
            <h3 className="text-[11px] font-bold text-fg-muted tracking-wider uppercase">
              {group.category}
            </h3>
          </div>
          <ul className="space-y-1">
            {group.tasks.map((task) => {
              const isSelected = activeTaskId === task.id;

              return (
                <li key={task.id}>
                  <RoadmapTaskItemButton
                    isSelected={isSelected}
                    status={task.status}
                    onClick={() => onTaskSelect(task.id)}
                  >
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {task.status === 'completed' && (
                        <RoadmapCompletedIcon className="w-4 h-4 text-cyan-500" />
                      )}

                      {task.status === 'current' && (
                        <RoadmapCurrentIcon className="w-4 h-4 text-slate-500" />
                      )}

                      {task.status === 'locked' && (
                        <RoadmapLockedIcon className="w-3.5 h-3.5 text-slate-400/70" />
                      )}
                    </div>
                    <span className="truncate flex-1 text-left">
                      {task.title}
                    </span>
                  </RoadmapTaskItemButton>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

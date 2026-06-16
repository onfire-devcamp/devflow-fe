import {
  type RoadmapTabButtonProps,
  type RoadmapTaskItemButtonProps,
  type RoadmapIconButtonProps,
} from '../RoadmapType';

export function RoadmapIconButton({
  children,
  ...props
}: RoadmapIconButtonProps) {
  return (
    <button
      className="text-fg hover:bg-slate-50 p-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors cursor-pointer"
      {...props}
    >
      {children}
    </button>
  );
}

export function RoadmapTabButton({
  children,
  active = false,
}: RoadmapTabButtonProps) {
  return (
    <button
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all cursor-pointer
        ${
          active
            ? 'bg-primary text-white shadow-sm font-semibold'
            : 'text-fg-muted hover:text-fg hover:bg-slate-50'
        }`}
    >
      {children}
    </button>
  );
}

export function RoadmapTaskItemButton({
  children,
  isSelected,
  status,
  onClick,
}: RoadmapTaskItemButtonProps) {
  const isLocked = status === 'locked';

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium select-none outline-none focus:outline-none border
        ${
          isSelected
            ? 'bg-primary-mid/40 text-fg font-semibold shadow-inner border-primary-mid/30 cursor-default'
            : isLocked
              ? 'text-slate-300 cursor-not-allowed opacity-50 border-transparent pointer-events-none' // Added pointer-events-none to natively block clicks via CSS
              : 'text-fg hover:bg-primary/20 cursor-pointer border-transparent'
        }`}
    >
      {children}
    </button>
  );
}

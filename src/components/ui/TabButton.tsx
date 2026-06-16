import React, { forwardRef } from 'react';

export interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  icon?: React.ElementType;
  label: string;
}

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ isActive, icon: Icon, label, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
        className={[
          'inline-flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap',
          'border-b-2 -mb-px transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
          isActive
            ? 'border-primary text-primary'
            : 'border-transparent text-fg-muted hover:text-fg hover:border-slate-300 cursor-pointer',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {Icon && (
          <Icon
            className="w-4 h-4 shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
        {label}
      </button>
    );
  },
);

TabButton.displayName = 'TabButton';

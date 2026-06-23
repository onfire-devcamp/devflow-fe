import React from 'react';
import type { ButtonVariant } from './Button.types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'w-full bg-primary hover:bg-primary/90 text-card rounded-xl py-3 shadow-xs',

    ghost: 'text-fg-muted hover:text-primary p-0 bg-transparent',

    outline:
      'w-full border border-primary-mid hover:bg-primary-soft text-fg rounded-xl py-3',
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

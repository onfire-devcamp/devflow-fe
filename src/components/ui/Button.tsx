import React from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
}
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
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
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

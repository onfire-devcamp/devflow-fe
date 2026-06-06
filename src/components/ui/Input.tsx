import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

export function Input({
  className = '',
  error,
  success,
  ...props
}: InputProps) {
  let borderStyles =
    'border-primary-mid focus:border-primary focus:ring-primary';
  if (error) {
    borderStyles = 'border-red-400 focus:border-red-400 focus:ring-red-300';
  } else if (success) {
    borderStyles =
      'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-300';
  }

  return (
    <input
      className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 transition bg-card text-fg placeholder-fg-muted disabled:opacity-50 disabled:cursor-not-allowed ${borderStyles} ${className}`}
      {...props}
    />
  );
}

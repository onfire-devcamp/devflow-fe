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
  const borderStyles = error
    ? 'border-red-400 focus:border-red-400 focus:ring-red-300'
    : success
      ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-300'
      : 'border-primary-mid focus:border-primary focus:ring-primary';

  return (
    <input
      className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 transition bg-card text-fg placeholder-fg-muted disabled:opacity-50 disabled:cursor-not-allowed ${borderStyles} ${className}`}
      {...props}
    />
  );
}

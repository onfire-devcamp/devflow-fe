import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full border border-pink-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition bg-white text-slate-800 placeholder-slate-400 ${className}`}
      {...props}
    />
  );
};

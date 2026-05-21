import React from 'react';
import { GoogleIcon } from '../icons/GoogleIcon';
type GoogleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      className={`w-full border border-pink-200 rounded-xl py-3 flex items-center justify-center space-x-2 hover:bg-pink-50 transition cursor-pointer ${className}`}
      {...props}
    >
      <GoogleIcon />
      <span className="text-sm font-medium text-slate-700 tracking-wide">
        Google
      </span>
    </button>
  );
};

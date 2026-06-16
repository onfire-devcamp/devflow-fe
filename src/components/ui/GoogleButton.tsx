import React from 'react';
import { GoogleIcon } from '../icons/GoogleIcon';
import { Button } from './Button';

interface GoogleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function GoogleButton({
  className = '',
  label,
  ...props
}: GoogleButtonProps) {
  return (
    <Button type="button" variant="outline" className={className} {...props}>
      <GoogleIcon />
      <span className="ml-2 tracking-wide">{label}</span>
    </Button>
  );
}

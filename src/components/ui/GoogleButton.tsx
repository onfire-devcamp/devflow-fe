import React from 'react';
import { GoogleIcon } from '../icons/GoogleIcon';
import { Button } from './Button';

type GoogleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  className = '',
  ...props
}) => {
  return (
    <Button type="button" variant="outline" className={className} {...props}>
      <GoogleIcon />
      <span className="ml-2 tracking-wide">Google</span>
    </Button>
  );
};

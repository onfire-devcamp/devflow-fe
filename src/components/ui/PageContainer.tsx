import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`min-h-screen flex flex-col font-sans bg-white ${className}`}
    >
      {children}
    </div>
  );
};

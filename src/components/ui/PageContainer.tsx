import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({
  children,
  className = '',
}: PageContainerProps) {
  return (
    <div className={`min-h-screen flex flex-col font-sans bg-bg ${className}`}>
      {children}
    </div>
  );
}

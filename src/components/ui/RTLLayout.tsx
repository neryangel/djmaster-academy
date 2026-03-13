import React from 'react';

interface RTLLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function RTLLayout({ children, className = '' }: RTLLayoutProps) {
  return (
    <div dir="rtl" lang="he" className={`font-hebrew ${className}`}>
      {children}
    </div>
  );
}

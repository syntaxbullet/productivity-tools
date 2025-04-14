import React from 'react';

interface WidgetSettingsContentProps {
  children: React.ReactNode;
  className?: string;
}

export function WidgetSettingsContent({
  children,
  className,
}: WidgetSettingsContentProps) {
  return (
    <div
      className={`space-y-4 text-sm text-muted-foreground ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

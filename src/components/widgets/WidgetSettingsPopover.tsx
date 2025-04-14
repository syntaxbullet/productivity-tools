import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import React from 'react';

interface WidgetSettingsPopoverProps {
  children: React.ReactNode;
  popoverContentClassName?: string;
}

export function WidgetSettingsPopover({
  children,
  popoverContentClassName,
}: WidgetSettingsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Settings />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`p-3 space-y-4 rounded-md shadow-md bg-white ${popoverContentClassName ?? 'w-64'}`}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

import { useThemeStore } from '../stores/themeStore';
import { ThemeDialog } from './ThemeDialog';
import { Palette, Clock, Timer } from 'lucide-react';
import { Button } from './ui/button';
import { useWidgetStore } from '@/stores/WidgetStore';
import { WidgetType, getAllWidgetTypes } from '@/lib/WidgetRegistry';
import React from 'react';

export function NavigationBar() {
  const { isDialogOpen, toggleDialog } = useThemeStore();
  const spawnWidget = useWidgetStore((state) => state.spawnWidget);

  const iconMap: Record<WidgetType, React.ReactNode> = {
    clock: <Clock className="w-5 h-5 mr-2" aria-hidden="true" />,
    pomodoro: <Timer className="w-5 h-5 mr-2" aria-hidden="true" />,
  };

  return (
    <>
      <Button
        variant="ghost"
        size="default"
        onClick={() => toggleDialog()}
        aria-haspopup="dialog"
        aria-expanded={isDialogOpen}
        className="inline-flex items-center m-4"
      >
        <Palette className="w-5 h-5 mr-2" aria-hidden="true" />
        Change theme
      </Button>
      {getAllWidgetTypes().map((type) => (
        <Button
          key={type}
          variant="ghost"
          size="default"
          onClick={() => spawnWidget(type)}
          className="inline-flex items-center m-4"
        >
          {iconMap[type]}
          Add {type.charAt(0).toUpperCase() + type.slice(1)} Widget
        </Button>
      ))}
      <ThemeDialog />
    </>
  );
}

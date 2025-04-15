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
    youtube: (
      <svg
        className="w-5 h-5 mr-2"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 15l5.19-3L10 9v6z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21.8 7.2a3.01 3.01 0 00-2.12-2.12C17.6 4.5 12 4.5 12 4.5s-5.6 0-7.68.58a3.01 3.01 0 00-2.12 2.12A31.4 31.4 0 002 12a31.4 31.4 0 00.2 4.8 3.01 3.01 0 002.12 2.12c2.08.58 7.68.58 7.68.58s5.6 0 7.68-.58a3.01 3.01 0 002.12-2.12A31.4 31.4 0 0022 12a31.4 31.4 0 00-.2-4.8zM9.5 15.5v-7l6 3.5-6 3.5z"
        />
      </svg>
    ),
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
      {getAllWidgetTypes().map((type) => {
        if (type === 'youtube') {
          return (
            <Button
              key={type}
              variant="ghost"
              size="default"
              onClick={() => {
                // spawnWidget only accepts one argument, so we handle youtube widget differently
                if (type === 'youtube') {
                  // Create a new widget with default videoId manually
                  const id = `widget-${Date.now()}`;
                  spawnWidget(type);
                  // The widget store does not support passing data on spawn, so we update data after spawn
                  setTimeout(() => {
                    const widget = useWidgetStore.getState().widgets[id];
                    if (widget) {
                      useWidgetStore.getState().updateWidgetData(id, {
                        videoId: 'dQw4w9WgXcQ',
                      });
                    }
                  }, 100);
                } else {
                  spawnWidget(type);
                }
              }}
              className="inline-flex items-center m-4"
            >
              {iconMap[type]}
              Add {type.charAt(0).toUpperCase() + type.slice(1)} Widget
            </Button>
          );
        }
        return (
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
        );
      })}
      <ThemeDialog />
    </>
  );
}

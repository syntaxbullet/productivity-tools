import { useThemeStore } from '../stores/themeStore';
import { ThemeDialog } from './ThemeDialog';
import { Palette, Clock, Timer } from 'lucide-react';
import { Button } from './ui/button';
import { useWidgetStore } from '@/stores/WidgetStore';
import { WidgetType, getAllWidgetTypes } from '@/lib/WidgetRegistry';
import React from 'react';
import { FaSpotify, FaYoutube, FaList } from 'react-icons/fa';

export function NavigationBar() {
  const { isDialogOpen, toggleDialog } = useThemeStore();
  const spawnWidget = useWidgetStore((state) => state.spawnWidget);
  const widgets = useWidgetStore((state) => state.widgets);
  const hasSpotifyWidget = Object.values(widgets).some(
    (w) => w.type === 'spotify'
  );

  const iconMap: Record<WidgetType, React.ReactNode> = {
    clock: <Clock className="w-5 h-5 mr-2" aria-hidden="true" />,
    pomodoro: <Timer className="w-5 h-5 mr-2" aria-hidden="true" />,
    youtube: <FaYoutube className="w-5 h-5 mr-2" aria-hidden="true" />,
    spotify: <FaSpotify className="w-5 h-5 mr-2" aria-hidden="true" />,
    todo: <FaList className="w-5 h-5 mr-2" aria-hidden="true" />,
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
                        videoId: 'jfKfPfyJRdk',
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
        // Hide the Spotify button if the widget is already present
        if (type === 'spotify' && hasSpotifyWidget) {
          return null;
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

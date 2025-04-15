import React from 'react';
import { ClockWidget } from '@/components/widgets/clock/ClockWidget';
import { PomodoroWidget } from '@/components/widgets/pomodoro/PomodoroWidget';
import YouTubePlayerWidget from '@/components/widgets/youtube/YouTubePlayerWidget';
import { SpotifyPlayerWidget } from '@/components/widgets/spotify/SpotifyPlayerWidget';

export type WidgetType = 'clock' | 'pomodoro' | 'youtube' | 'spotify';

export interface WidgetDefaults {
  type: WidgetType;
  component: React.FC<any>;
  defaultProps: {
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
  };
}

const widgetRegistry: Record<WidgetType, WidgetDefaults> = {
  clock: {
    type: 'clock',
    component: ClockWidget,
    defaultProps: {
      minWidth: 160,
      minHeight: 60,
      maxWidth: 800,
      maxHeight: 500,
    },
  },
  pomodoro: {
    type: 'pomodoro',
    component: PomodoroWidget,
    defaultProps: {
      minWidth: 250,
      minHeight: 280,
      maxWidth: 800,
      maxHeight: 500,
    },
  },
  youtube: {
    type: 'youtube',
    component: YouTubePlayerWidget,
    defaultProps: {
      minWidth: 480,
      minHeight: 320,
      maxWidth: 1440,
      maxHeight: 810,
    },
  },
  spotify: {
    type: 'spotify',
    component: SpotifyPlayerWidget,
    defaultProps: {
      minWidth: 360,
      minHeight: 380,
      maxWidth: 1440,
      maxHeight: 810,
    },
  },
};

export function getWidgetComponent(type: WidgetType) {
  return widgetRegistry[type]?.component;
}

export function getWidgetDefaults(type: WidgetType) {
  return widgetRegistry[type]?.defaultProps;
}

export function getAllWidgetTypes(): WidgetType[] {
  return Object.keys(widgetRegistry) as WidgetType[];
}

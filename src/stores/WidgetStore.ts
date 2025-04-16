import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Position = { x: number; y: number };
type Size = { width: number; height: number };

import { WidgetType, getWidgetDefaults } from '@/lib/WidgetRegistry';

export type Widget = {
  id: string;
  type: WidgetType;
  position: Position;
  initialSize: Size;
  size: Size;
  parentId?: string;
  children?: string[];
  data: any;
  zIndex: number;
};

export interface WidgetSizeOverrides {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

type WidgetStore = {
  widgets: { [id: string]: Widget };

  addWidget: (widget: Widget) => void;
  spawnWidget: (type: WidgetType, overrides?: WidgetSizeOverrides) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, update: Partial<Widget>) => void;
  updateWidgetData: (id: string, data: any) => void;
};

export const useWidgetStore = create<WidgetStore>()(
  devtools(
    persist(
      (set, get) => ({
        widgets: {},

        addWidget: (widget) =>
          set((state) => ({
            widgets: { ...state.widgets, [widget.id]: widget },
          })),

        removeWidget: (id) =>
          set((state) => {
            const newWidgets = { ...state.widgets };
            delete newWidgets[id];
            return { widgets: newWidgets };
          }),

        updateWidget: (id, update) =>
          set((state) => ({
            widgets: {
              ...state.widgets,
              [id]: {
                ...state.widgets[id],
                ...update,
              },
            },
          })),

        updateWidgetData: (id, data) =>
          set((state) => {
            const widget = state.widgets[id];
            return {
              widgets: {
                ...state.widgets,
                [id]: {
                  ...widget,
                  data: {
                    ...widget.data,
                    ...data,
                  },
                },
              },
            };
          }),

        spawnWidget: (type: WidgetType, overrides?: WidgetSizeOverrides) => {
          const id = crypto.randomUUID();
          const widgetDefaults = getWidgetDefaults(type);
          if (!widgetDefaults) return;
          const widgetsArray = Object.values(get().widgets);
          const maxZIndex =
            widgetsArray.length > 0
              ? Math.max(...widgetsArray.map((w) => w.zIndex))
              : 0;
          // Allow min/max constraints to be overridden by caller (e.g., from widget props)
          const minWidth = Math.max(
            widgetDefaults.minWidth,
            overrides?.minWidth ?? widgetDefaults.minWidth
          );
          const minHeight = Math.max(
            widgetDefaults.minHeight,
            overrides?.minHeight ?? widgetDefaults.minHeight
          );
          const newWidget: Widget = {
            id,
            type,
            position: { x: 100, y: 70 + 20 },
            initialSize: {
              width: minWidth,
              height: minHeight,
            },
            size: {
              width: minWidth,
              height: minHeight,
            },
            data: {},
            zIndex: maxZIndex + 1,
          };
          set((state) => ({
            widgets: { ...state.widgets, [id]: newWidget },
          }));
        },
      }),
      {
        name: 'widget-store',
      }
    )
  )
);

export const useWidget = (id: string) =>
  useWidgetStore((state) => state.widgets[id]);

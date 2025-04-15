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

type WidgetStore = {
  widgets: { [id: string]: Widget };

  addWidget: (widget: Widget) => void;
  spawnWidget: (type: WidgetType) => void;
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

        spawnWidget: (type: WidgetType) => {
          const id = crypto.randomUUID();
          const widgetDefaults = getWidgetDefaults(type);
          if (!widgetDefaults) return;
          const widgetsArray = Object.values(get().widgets);
          const maxZIndex =
            widgetsArray.length > 0
              ? Math.max(...widgetsArray.map((w) => w.zIndex))
              : 0;
          const newWidget: Widget = {
            id,
            type,
            position: { x: 100, y: 70 + 20 },
            initialSize: {
              width: widgetDefaults.minWidth,
              height: widgetDefaults.minHeight,
            },
            size: {
              width: widgetDefaults.minWidth,
              height: widgetDefaults.minHeight,
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

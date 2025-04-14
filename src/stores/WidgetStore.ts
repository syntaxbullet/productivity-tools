import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Position = { x: number; y: number };
type Size = { width: number; height: number };

export type Widget = {
  id: string;
  type: string;
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
  removeWidget: (id: string) => void;
  updateWidget: (id: string, update: Partial<Widget>) => void;
  updateWidgetData: (id: string, data: any) => void;
};

export const useWidgetStore = create<WidgetStore>()(
  devtools(
    persist(
      (set) => ({
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
      }),
      {
        name: 'widget-store',
      }
    )
  )
);

export const useWidget = (id: string) =>
  useWidgetStore((state) => state.widgets[id]);

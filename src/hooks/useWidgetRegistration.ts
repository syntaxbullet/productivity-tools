import { useEffect, RefObject, MutableRefObject } from 'react';
import type { Widget } from '@/stores/WidgetStore';

interface WidgetRegistrationParams {
  widget: Widget | undefined;
  node:
    | RefObject<HTMLElement>
    | MutableRefObject<HTMLElement | null>
    | undefined;
  didRegister: MutableRefObject<boolean>;
  id: string;
  type: string;
  addWidget: (widget: Widget) => void;
  data?: Widget['data'];
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export function useWidgetRegistration({
  widget,
  node,
  didRegister,
  id,
  type,
  addWidget,
  data,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
}: WidgetRegistrationParams): void {
  useEffect(() => {
    if (!widget && node?.current && !didRegister.current) {
      didRegister.current = true;
      const rect = node.current.getBoundingClientRect();

      // Clamp width/height to min/max constraints if provided
      let width = rect.width;
      let height = rect.height;
      if (typeof minWidth === 'number') width = Math.max(width, minWidth);
      if (typeof minHeight === 'number') height = Math.max(height, minHeight);
      if (typeof maxWidth === 'number') width = Math.min(width, maxWidth);
      if (typeof maxHeight === 'number') height = Math.min(height, maxHeight);

      addWidget({
        id,
        type: type,
        position: {
          x: window.innerWidth / 2 - width / 2,
          y: window.innerHeight / 2 - height / 2,
        },
        size: {
          width,
          height,
        },
        initialSize: {
          width,
          height,
        },
        zIndex: 1,
        data: data || {},
      } as Widget);
    }
  }, [
    widget,
    id,
    addWidget,
    node,
    type,
    data,
    didRegister,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
  ]);
}

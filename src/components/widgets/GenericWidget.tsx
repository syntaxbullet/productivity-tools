import { useDraggable } from '@dnd-kit/core';
import { useMemo, useRef, CSSProperties } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

import { useWidgetStore } from '@/stores/WidgetStore';
import { CustomResizeHandle } from './CustomResizeHandle';
import { useWidgetRegistration } from './useWidgetRegistration';
import type { Widget } from '@/stores/WidgetStore';

interface WidgetProps {
  children: React.ReactNode;
  id: string;
  type: string;
  data?: Widget['data'];
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export function GenericWidget({
  children,
  id,
  type,
  data,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
}: WidgetProps) {
  const { attributes, listeners, setNodeRef, transform, node } = useDraggable({
    id,
  });
  const { addWidget } = useWidgetStore();
  const didRegister = useRef(false);
  const widget: Widget | undefined = useWidgetStore((s) => s.widgets[id]);
  const updateWidget = useWidgetStore((s) => s.updateWidget);
  const translateX = transform?.x ?? 0;
  const translateY = transform?.y ?? 0;

  // Register the widget in the global store if it doesn't exist yet
  useWidgetRegistration({
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
  });

  // Compute the widget's absolute position and size, including drag transform
  const style = useMemo(
    (): CSSProperties => ({
      transform: `translate(${translateX}px, ${translateY}px)`,
      left: widget?.position?.x ?? 0,
      top: widget?.position?.y ?? 0,
      width: widget?.size?.width,
      height: widget?.size?.height,
      touchAction: 'auto',
      cursor: 'grab',
      position: 'absolute',
    }),
    [translateX, translateY, widget]
  );

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="w-fit h-fit bg-background border-2 rounded widget"
      tabIndex={0}
      role="region"
      aria-label={`Widget ${id}`}
    >
      {widget ? (
        <ResizableBox
          width={widget.size.width}
          height={widget.size.height}
          minConstraints={[
            typeof minWidth === 'number' ? minWidth : widget.initialSize.width,
            typeof minHeight === 'number'
              ? minHeight
              : widget.initialSize.height,
          ]}
          maxConstraints={
            typeof maxWidth === 'number' && typeof maxHeight === 'number'
              ? [maxWidth, maxHeight]
              : undefined
          }
          handle={<CustomResizeHandle />}
          onResize={(_e, data) => {
            updateWidget(id, { size: data.size });
          }}
        >
          {children}
        </ResizableBox>
      ) : (
        children
      )}
    </div>
  );
}

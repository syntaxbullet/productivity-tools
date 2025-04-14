import { useDraggable } from '@dnd-kit/core';
import { useEffect, useMemo, useRef, useState, CSSProperties } from 'react';
import { useWidgetStore } from '@/stores/WidgetStore';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

// Define a custom handle that stops propagation.
const customResizeHandle = (
  <span
    className="custom-resize-handle"
    onPointerDown={(e) => e.stopPropagation()}
    onTouchStart={(e) => e.stopPropagation()}
    style={{
      position: 'absolute' as const,
      right: 0,
      bottom: 0,
      width: '16px',
      height: '16px',
      cursor: 'se-resize',
      background: 'transparent',
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
    >
      <polyline points="20,0 20,20 0,20" fill="rgba(0, 0, 0, 0.2)" />
    </svg>
  </span>
);

export function GenericWidget({
  children,
  id,
  type,
  data,
}: {
  children: React.ReactNode;
  id: string;
  type: string;
  data?: any;
}) {
  const { attributes, listeners, setNodeRef, transform, node } = useDraggable({
    id,
  });
  const { addWidget } = useWidgetStore();
  const didRegister = useRef(false);
  const [_isHovered, setIsHovered] = useState(false);
  const widget = useWidgetStore((s) => s.widgets[id]);
  const updateWidget = useWidgetStore((s) => s.updateWidget);
  const translateX = transform?.x ?? 0;
  const translateY = transform?.y ?? 0;

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

  useEffect(() => {
    if (!widget && node?.current && !didRegister.current) {
      didRegister.current = true;
      const rect = node.current.getBoundingClientRect();
      addWidget({
        id,
        type: type,
        position: { x: 0, y: 0 },
        size: {
          width: rect.width,
          height: rect.height,
        },
        initialSize: {
          width: rect.width,
          height: rect.height,
        },
        zIndex: 1,
        data: data || {},
      });
    }
  }, [widget, id, addWidget, node]);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="w-fit h-fitbg-background border-2 rounded absolute"
      onPointerOver={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {widget ? (
        <ResizableBox
          width={widget.size.width}
          height={widget.size.height}
          minConstraints={[widget.initialSize.width, widget.initialSize.height]}
          handle={customResizeHandle}
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

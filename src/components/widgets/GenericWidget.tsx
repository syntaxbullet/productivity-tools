import { useDraggable } from '@dnd-kit/core';
import { useMemo, useRef, CSSProperties, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

import { useWidgetStore } from '@/stores/WidgetStore';
import { CustomResizeHandle } from './CustomResizeHandle';
import { useWidgetRegistration } from '../../hooks/useWidgetRegistration';
import type { Widget } from '@/stores/WidgetStore';
import { Button } from '../ui/button';
import { Pin, PinOff, X } from 'lucide-react';

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
  const removeWidget = useWidgetStore((s) => s.removeWidget);
  const translateX = widget && widget.data.isPinned ? 0 : (transform?.x ?? 0);
  const translateY = widget && widget.data.isPinned ? 0 : (transform?.y ?? 0);
  const [isHovered, setIsHovered] = useState(false);

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
      position: 'absolute',
    }),
    [translateX, translateY, widget]
  );

  const handleWidgetRemove = () => {
    removeWidget(id);
    didRegister.current = true; // prevent instant re-registration before removing it from the DOM.
    node.current?.remove();
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`w-fit h-fit bg-background border-2 ${widget?.data.isPinned ? 'border-solid cursor-auto' : 'border-dashed cursor-grab'} rounded widget`}
      tabIndex={0}
      role="region"
      aria-label={`Widget ${id}`}
      onPointerOver={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {widget ? (
        <>
          {isHovered && (
            <div
              className={`widget-controls absolute ${widget?.position.y > 80 ? 'top-[-72px]' : 'bottom-[-72px]'} py-6 w-full flex justify-between`}
            >
              <Button
                variant={'outline'}
                size={'icon'}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => handleWidgetRemove()}
              >
                <X />
              </Button>
              <Button
                variant={'outline'}
                size={'icon'}
                onClick={() => {
                  updateWidget(id, {
                    data: { isPinned: !widget.data.isPinned },
                  });
                  console.log('clicked');
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {widget.data.isPinned ? <PinOff /> : <Pin />}
              </Button>
            </div>
          )}
          <ResizableBox
            width={widget.size.width}
            height={widget.size.height}
            minConstraints={[
              typeof minWidth === 'number'
                ? minWidth
                : widget.initialSize.width,
              typeof minHeight === 'number'
                ? minHeight
                : widget.initialSize.height,
            ]}
            maxConstraints={
              typeof maxWidth === 'number' && typeof maxHeight === 'number'
                ? [maxWidth, maxHeight]
                : undefined
            }
            handle={widget.data.isPinned ? <div></div> : <CustomResizeHandle />}
            onResize={(_e, data) => {
              updateWidget(id, { size: data.size });
            }}
          >
            {children}
          </ResizableBox>
        </>
      ) : (
        children
      )}
    </div>
  );
}

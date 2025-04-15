import { useMemo, useState, useEffect } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

import { useWidgetStore } from '@/stores/WidgetStore';
import { CustomResizeHandle } from '../CustomResizeHandle';
import { useWidgetRegistration } from '@/hooks/useWidgetRegistration';
import { useWidgetDrag } from '@/hooks/useWidgetDrag';
import type { Widget } from '@/stores/WidgetStore';
import { Button } from '@/components/ui/button';
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
  onHoverChange?: (isHovered: boolean) => void;
  customActionButtons?: React.ReactNode;
  customButtonsPosition?: 'above' | 'below';
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
  onHoverChange,
  customActionButtons,
  customButtonsPosition,
}: WidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    node,
    didRegister,
    translateX,
    translateY,
  } = useWidgetDrag(id);

  const widgets = useWidgetStore((state) => state.widgets);
  const updateWidgetStore = useWidgetStore((state) => state.updateWidget);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (transform && !isDragging) {
      // Drag started
      setIsDragging(true);
      // Find max zIndex among all widgets
      const maxZIndex = Math.max(
        ...Object.values(widgets).map((w) => w.zIndex || 0)
      );
      // Update this widget's zIndex to max + 1
      updateWidgetStore(id, { zIndex: maxZIndex + 1 });
    } else if (!transform && isDragging) {
      // Drag ended
      setIsDragging(false);
      // zIndex persists, so no change needed here
    }
  }, [transform, isDragging, id, updateWidgetStore, widgets]);

  const { addWidget } = useWidgetStore();
  const widget: Widget | undefined = useWidgetStore((s) => s.widgets[id]);
  const updateWidgetData = useWidgetStore((s) => s.updateWidgetData);
  const updateWidget = useWidgetStore((s) => s.updateWidget);
  const removeWidget = useWidgetStore((s) => s.removeWidget);
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

  // Notify parent of hover state change
  const handlePointerOver = () => {
    setIsHovered(true);
    if (onHoverChange) onHoverChange(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (onHoverChange) onHoverChange(false);
  };

  // Compute the widget's absolute position and size, including drag transform
  const style = useMemo(
    () => ({
      transform: widget?.data.isPinned
        ? 'none'
        : `translate(${translateX}px, ${translateY}px)`,
      left: widget?.position?.x ?? 0,
      top: widget?.position?.y ?? 0,
      width: widget?.size?.width,
      height: widget?.size?.height,
      touchAction: 'auto',
      position: 'absolute' as 'absolute',
      zIndex: widget?.zIndex ?? 'auto',
    }),
    [translateX, translateY, widget, transform]
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
      className={`w-fit h-fit bg-background border-2 ${
        widget?.data.isPinned
          ? 'border-solid cursor-auto'
          : 'border-dashed cursor-grab'
      } rounded widget`}
      tabIndex={0}
      role="region"
      aria-label={`Widget ${id}`}
      onPointerOver={handlePointerOver}
      onPointerLeave={handlePointerLeave}
    >
      {widget ? (
        <>
          {isHovered && (
            <div
              className={`widget-controls absolute ${
                customButtonsPosition
                  ? customButtonsPosition === 'above'
                    ? 'top-[-72px]'
                    : 'bottom-[-72px]'
                  : widget?.position.y > 80
                    ? 'top-[-72px]'
                    : 'bottom-[-72px]'
              } py-6 w-full flex justify-between items-center gap-2`}
            >
              <div className="flex items-center gap-2">
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
                    updateWidgetData(id, { isPinned: !widget.data.isPinned });
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {widget.data.isPinned ? <PinOff /> : <Pin />}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {customActionButtons}
              </div>
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

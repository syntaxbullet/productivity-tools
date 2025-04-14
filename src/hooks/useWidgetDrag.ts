import { useDraggable } from '@dnd-kit/core';
import { useRef } from 'react';

export function useWidgetDrag(id: string) {
  const { attributes, listeners, setNodeRef, transform, node } = useDraggable({
    id,
  });

  const didRegister = useRef(false);

  const translateX = transform?.x ?? 0;
  const translateY = transform?.y ?? 0;

  return {
    attributes,
    listeners,
    setNodeRef,
    transform,
    node,
    didRegister,
    translateX,
    translateY,
  };
}

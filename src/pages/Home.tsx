import { DndContext, DragEndEvent, Modifier } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useWidgetStore } from '@/stores/WidgetStore';
import { ClockWidget } from '@/components/widgets/clock/ClockWidget';
import { PomodoroWidget } from '@/components/widgets/pomodoro/PomodoroWidget';

const NAV_BAR_HEIGHT = 70; // Navigation bar height plus vertical padding

const restrictToBelowNavBar: Modifier = ({ transform, active }) => {
  const widgetId = active?.id as string | undefined;
  if (!widgetId) {
    return transform;
  }
  const widget = useWidgetStore.getState().widgets[widgetId];
  if (!widget) {
    return transform;
  }
  const initialY = widget.position.y;
  // Calculate the new Y position after applying transform
  const newY = initialY + transform.y;
  // Restrict newY to be at least NAV_BAR_HEIGHT
  const restrictedY = Math.max(newY, NAV_BAR_HEIGHT);
  // Return the transform with adjusted y relative to initial position
  return {
    ...transform,
    y: restrictedY - initialY,
  };
};

export default function Home() {
  const updateWidget = useWidgetStore((state) => state.updateWidget);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const id = active.id as string;
    const widget = useWidgetStore.getState().widgets[id];
    if (widget && !widget.data.isPinned) {
      const newPos = {
        x: widget.position.x + delta.x,
        y: widget.position.y + delta.y,
      };
      updateWidget(id, { position: { x: newPos.x, y: newPos.y } });
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges, restrictToBelowNavBar]}
    >
      <ClockWidget
        id="clock"
        type="clock"
        minWidth={160}
        minHeight={60}
        maxHeight={500}
        maxWidth={800}
      />
      <PomodoroWidget
        id="pomodoro"
        type="pomodoro"
        minWidth={250}
        minHeight={280}
        maxHeight={500}
        maxWidth={800}
      />
    </DndContext>
  );
}

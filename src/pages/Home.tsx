import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useWidgetStore } from '@/stores/WidgetStore';
import { GenericWidget } from '@/components/widgets/GenericWidget';

export default function Home() {
  const updateWidget = useWidgetStore((state) => state.updateWidget);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const id = active.id as string;
    const widget = useWidgetStore.getState().widgets[id];
    if (widget) {
      const newPos = {
        x: widget.position.x + delta.x,
        y: widget.position.y + delta.y,
      };
      updateWidget(id, { position: { x: newPos.x, y: newPos.y } });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
      <GenericWidget
        id="debug"
        type="debug"
        minWidth={500}
        minHeight={200}
        maxHeight={800}
        maxWidth={800}
      >
        <div className="debug">This is a widget with some longer content.</div>
      </GenericWidget>
    </DndContext>
  );
}

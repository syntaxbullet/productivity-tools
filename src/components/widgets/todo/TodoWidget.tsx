import React from 'react';
import { TodoList } from './TodoList';
import { TodoInput } from './TodoInput';
import { useWidgetStore } from '../../../stores/WidgetStore';
import { GenericWidget } from '../GenericWidget';

export const TodoWidget: React.FC<{ id: string }> = ({ id }) => {
  const data = useWidgetStore((state) => state.widgets[id]?.data);
  const updateWidget = useWidgetStore((state) => state.updateWidget);
  const setWidgetData = React.useCallback(
    (data: any) => updateWidget(id, { data }),
    [updateWidget, id]
  );

  const safeData = Array.isArray(data) ? data : [];

  const handleAdd = (text: string) => {
    setWidgetData([
      ...safeData,
      { id: Date.now().toString(), text, completed: false },
    ]);
  };

  const handleToggle = (todoId: string) => {
    setWidgetData(
      safeData.map((todo: any) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleRemove = (todoId: string) => {
    setWidgetData(safeData.filter((todo: any) => todo.id !== todoId));
  };

  return (
    <GenericWidget id={id} type="todo" minHeight={400}>
      <div className="p-4 h-full">
        <div className="h-full flex flex-col bg-background border-none w-full outline-none">
          <div className="flex flex-col gap-4 flex-1 h-full">
            <TodoInput onAdd={handleAdd} />
            <TodoList
              todos={safeData}
              onToggle={handleToggle}
              onRemove={handleRemove}
            />
          </div>
        </div>
      </div>
    </GenericWidget>
  );
};

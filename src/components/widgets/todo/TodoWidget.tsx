import React from 'react';
import { TodoList } from './TodoList';
import { TodoInput } from './TodoInput';
import { useWidgetStore } from '../../../stores/WidgetStore';
import { GenericWidget } from '../GenericWidget';

export const TodoWidget: React.FC<{ id: string }> = ({ id }) => {
  const data = useWidgetStore((state) => state.widgets[id]?.data);
  const updateWidgetData = useWidgetStore((state) => state.updateWidgetData);

  // Only use data.todos as the source of truth for todos
  const safeTodos = Array.isArray(data?.todos) ? data.todos : [];

  const handleAdd = (text: string) => {
    updateWidgetData(id, {
      todos: [
        ...safeTodos,
        { id: Date.now().toString(), text, completed: false },
      ],
    });
  };

  const handleToggle = (todoId: string) => {
    updateWidgetData(id, {
      todos: safeTodos.map((todo: any) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      ),
    });
  };

  const handleRemove = (todoId: string) => {
    updateWidgetData(id, {
      todos: safeTodos.filter((todo: any) => todo.id !== todoId),
    });
  };

  return (
    <GenericWidget id={id} type="todo" minHeight={400}>
      <div className="p-4 h-full">
        <div className="h-full flex flex-col bg-background border-none w-full outline-none">
          <div className="flex flex-col gap-4 flex-1 h-full">
            <TodoInput onAdd={handleAdd} />
            <TodoList
              todos={safeTodos}
              onToggle={handleToggle}
              onRemove={handleRemove}
            />
          </div>
        </div>
      </div>
    </GenericWidget>
  );
};

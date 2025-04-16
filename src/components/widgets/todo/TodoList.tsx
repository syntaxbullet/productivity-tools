import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Trash } from 'lucide-react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onRemove,
}) => (
  <div className="overflow-auto h-full todo-scrollbar">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Done</TableHead>
          <TableHead>Task</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={3}
              className="text-center text-muted-foreground py-8"
            >
              No todos yet!
            </TableCell>
          </TableRow>
        ) : (
          todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>
                <input
                  type="checkbox"
                  className="size-4 accent-muted rounded border-input bg-background text-primary focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring transition disabled:opacity-50 disabled:cursor-not-allowed"
                  checked={todo.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggle(todo.id);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  aria-label={
                    todo.completed ? 'Mark as incomplete' : 'Mark as complete'
                  }
                />
              </TableCell>
              <TableCell>
                <span
                  className={
                    'flex-1 cursor-pointer select-none ' +
                    (todo.completed ? 'line-through text-muted-foreground' : '')
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(todo.id);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {todo.text}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(todo.id);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

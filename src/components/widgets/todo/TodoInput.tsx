import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo..."
        className="flex-1"
        onPointerDown={(e) => e.stopPropagation()}
        type="text"
        autoComplete="off"
        onKeyDown={(e) => {
          // Always allow space key in the input
          if (e.key === ' ') {
            e.stopPropagation();
          }
          // Explicitly handle Enter key
          if (e.key === 'Enter') {
            e.stopPropagation();
            // Let the form's onSubmit handle the add logic
          }
        }}
      />
      <Button
        type="submit"
        disabled={!text.trim()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        Add
      </Button>
    </form>
  );
};

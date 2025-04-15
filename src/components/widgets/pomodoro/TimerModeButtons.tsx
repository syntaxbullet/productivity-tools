import { Button } from '@/components/ui/button';

interface TimerModeButtonsProps {
  currentMode: 'pomodoro' | 'shortBreak' | 'longBreak';
  setMode: (mode: 'pomodoro' | 'shortBreak' | 'longBreak') => void;
}

export function TimerModeButtons({
  currentMode,
  setMode,
}: TimerModeButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 w-full max-w-md">
      <Button
        variant={currentMode === 'pomodoro' ? 'default' : 'outline'}
        onClick={() => setMode('pomodoro')}
        onPointerDown={(e) => e.stopPropagation()}
        size="sm"
      >
        Focus
      </Button>
      <Button
        variant={currentMode === 'shortBreak' ? 'default' : 'outline'}
        onClick={() => setMode('shortBreak')}
        onPointerDown={(e) => e.stopPropagation()}
        size="sm"
      >
        Short Break
      </Button>
      <Button
        variant={currentMode === 'longBreak' ? 'default' : 'outline'}
        onClick={() => setMode('longBreak')}
        onPointerDown={(e) => e.stopPropagation()}
        size="sm"
      >
        Long Break
      </Button>
    </div>
  );
}

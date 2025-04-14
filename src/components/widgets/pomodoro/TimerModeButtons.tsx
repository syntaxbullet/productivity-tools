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
        className="flex-1 min-w-[90px]"
        variant={currentMode === 'pomodoro' ? 'default' : 'outline'}
        onClick={() => setMode('pomodoro')}
        onPointerDown={(e) => e.stopPropagation()}
        size="sm"
      >
        Pomodoro
      </Button>
      <Button
        className="flex-1 min-w-[90px]"
        variant={currentMode === 'shortBreak' ? 'default' : 'outline'}
        onClick={() => setMode('shortBreak')}
        onPointerDown={(e) => e.stopPropagation()}
        size="sm"
      >
        Short Break
      </Button>
      <Button
        className="flex-1 min-w-[90px]"
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

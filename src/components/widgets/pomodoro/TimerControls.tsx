import { Button } from '@/components/ui/button';

interface TimerControlsProps {
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function TimerControls({
  isRunning,
  start,
  pause,
  reset,
}: TimerControlsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 w-full max-w-xs">
      <Button
        className="flex-1 min-w-[90px]"
        onClick={isRunning ? pause : start}
        variant="outline"
        size="sm"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {isRunning ? 'Pause' : 'Start'}
      </Button>
      <Button
        className="flex-1 min-w-[90px]"
        onClick={reset}
        variant="outline"
        size="sm"
        onPointerDown={(e) => e.stopPropagation()}
      >
        Reset
      </Button>
    </div>
  );
}

interface TimerStatusLabelProps {
  currentMode: 'pomodoro' | 'shortBreak' | 'longBreak';
}

export function TimerStatusLabel({ currentMode }: TimerStatusLabelProps) {
  const label =
    currentMode === 'pomodoro'
      ? 'Focus'
      : currentMode === 'shortBreak'
        ? 'Short Break'
        : 'Long Break';

  return (
    <div className="text-center text-lg font-semibold text-muted-foreground capitalize">
      {label}
    </div>
  );
}

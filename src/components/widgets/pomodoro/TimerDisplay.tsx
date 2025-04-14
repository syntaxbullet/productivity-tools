interface TimerDisplayProps {
  formattedTime: string;
  fontSizePx: number;
}

export function TimerDisplay({ formattedTime, fontSizePx }: TimerDisplayProps) {
  return (
    <div
      className="font-mono font-bold text-center leading-[1]"
      style={{ fontSize: `${fontSizePx}px` }}
    >
      {formattedTime}
    </div>
  );
}

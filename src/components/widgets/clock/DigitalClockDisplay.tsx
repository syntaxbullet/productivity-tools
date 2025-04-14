interface DigitalClockDisplayProps {
  formattedTime: string;
  fontSizePx: number;
}

export function DigitalClockDisplay({
  formattedTime,
  fontSizePx,
}: DigitalClockDisplayProps) {
  return (
    <div
      className="flex justify-center items-center p-2 w-full h-full overflow-hidden"
      style={{ fontSize: `${fontSizePx}px` }}
    >
      {formattedTime}
    </div>
  );
}

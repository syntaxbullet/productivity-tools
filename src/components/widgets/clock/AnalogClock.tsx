interface AnalogClockProps {
  size: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function AnalogClock({
  size,
  hours,
  minutes,
  seconds,
}: AnalogClockProps) {
  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourAngle = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="border border-border rounded-full bg-background"
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        height: 'auto',
        width: 'auto',
      }}
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        className="stroke-border"
        fill="none"
        strokeWidth="2"
      />
      {/* Minute ticks */}
      <circle
        cx="50"
        cy="50"
        r="44"
        className="stroke-border"
        fill="none"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      {/* Hour ticks */}
      {[...Array(12)].map((_, i) => {
        const angle = i * 30;
        return (
          <line
            key={i}
            x1="50"
            y1={50 - 48}
            x2="50"
            y2={50 - 42}
            className="stroke-primary"
            strokeWidth={2}
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
      {/* 12, 3, 6, 9 indicators */}
      <text
        x="50"
        y="18"
        textAnchor="middle"
        fontSize="10"
        className="fill-primary font-bold"
      >
        12
      </text>
      <text
        x="82"
        y="55"
        textAnchor="middle"
        fontSize="10"
        className="fill-primary font-bold"
      >
        3
      </text>
      <text
        x="50"
        y="90"
        textAnchor="middle"
        fontSize="10"
        className="fill-primary font-bold"
      >
        6
      </text>
      <text
        x="18"
        y="55"
        textAnchor="middle"
        fontSize="10"
        className="fill-primary font-bold"
      >
        9
      </text>
      {/* Hour hand */}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="30"
        className="stroke-primary"
        strokeWidth="4"
        strokeLinecap="round"
        transform={`rotate(${hourAngle} 50 50)`}
      />
      {/* Minute hand */}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="20"
        className="stroke-primary"
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${minuteAngle} 50 50)`}
      />
      {/* Second hand */}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="15"
        className="stroke-destructive"
        strokeWidth="1"
        strokeLinecap="round"
        transform={`rotate(${secondAngle} 50 50)`}
      />
      <circle cx="50" cy="50" r="2" className="fill-primary" />
    </svg>
  );
}

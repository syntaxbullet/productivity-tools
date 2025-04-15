import React from 'react';

interface VisualTimerDisplayProps {
  secondsLeft: number;
  totalSeconds: number;
  fontSizePx: number;
  inverted?: boolean;
}

export const VisualTimerDisplay: React.FC<VisualTimerDisplayProps> = ({
  secondsLeft,
  totalSeconds,
  fontSizePx,
  inverted = false,
}) => {
  const scaleFactor = 3;
  const scaledFontSizePx = fontSizePx * scaleFactor;
  const progress = (totalSeconds - secondsLeft) / totalSeconds;
  // Increase size by scaling radius and stroke width
  const radius = scaledFontSizePx * 0.35;
  const circumference = 2 * Math.PI * radius;
  // Adjust strokeDashoffset for inverted display
  const strokeDashoffset = inverted
    ? circumference * (1 - progress)
    : circumference * progress;
  // Add padding to SVG size to prevent clipping of numbers
  const padding = scaledFontSizePx * 0.2;
  const svgSize = scaledFontSizePx + padding * 2;
  const center = svgSize / 2;
  const strokeWidth = scaledFontSizePx * 0.12;
  const fontSizeNumbers = scaledFontSizePx * 0.08;

  // Generate numbers 0 to 55 in steps of 5
  const numbers = Array.from({ length: 12 }, (_, i) => i * 5);

  // Calculate hand rotation angle, invert if needed
  const handRotation = inverted ? -secondsLeft * 0.1 : secondsLeft * 0.1;

  return (
    <svg
      aria-label="Visual timer display"
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
    >
      <circle
        cx={center}
        cy={center}
        r={radius * 0.8}
        fill="none"
        className="stroke-muted"
        strokeWidth={strokeWidth * 0.3}
      />
      <circle
        cx={center}
        cy={center}
        r={radius * 0.8}
        fill="none"
        className="stroke-primary/60"
        strokeWidth={strokeWidth * 0.3}
        strokeDasharray={circumference * 0.8}
        strokeDashoffset={strokeDashoffset * 0.8}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s linear' }}
        transform={`rotate(-90 ${center} ${center})`}
      />
      {numbers.map((num) => {
        // Calculate angle in radians, with 0 at top (12 o'clock)
        const angle = (num / 60) * 2 * Math.PI - Math.PI / 2;
        // Position numbers slightly outside the circle
        const x = center + (radius + strokeWidth * 0.5) * Math.cos(angle);
        const y = center + (radius + strokeWidth * 0.5) * Math.sin(angle);
        return (
          <text
            key={num}
            x={x}
            y={y}
            fontSize={fontSizeNumbers}
            className="fill-foreground/50"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ userSelect: 'none' }}
          >
            {num}
          </text>
        );
      })}
      {[...Array(60)].map((_, i) => {
        const tickLength = strokeWidth * 0.4;
        const angle = (i / 60) * 360;
        const innerRadius = radius + strokeWidth * 1.2;
        const outerRadius = innerRadius + tickLength;
        const x1 =
          center + innerRadius * Math.cos((angle - 90) * (Math.PI / 180));
        const y1 =
          center + innerRadius * Math.sin((angle - 90) * (Math.PI / 180));
        const x2 =
          center + outerRadius * Math.cos((angle - 90) * (Math.PI / 180));
        const y2 =
          center + outerRadius * Math.sin((angle - 90) * (Math.PI / 180));
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="stroke-muted"
            strokeWidth={strokeWidth * 0.15}
            strokeLinecap="round"
            strokeDasharray="2 2"
          />
        );
      })}
      <line
        x1={center}
        y1={center}
        x2={center}
        y2={center - radius}
        className="stroke-destructive"
        strokeWidth={strokeWidth * 0.3}
        strokeLinecap="round"
        style={{
          transformOrigin: `${center}px ${center}px`,
          transform: `rotate(${handRotation}deg)`,
          transition: 'transform 0.5s linear',
        }}
      />
    </svg>
  );
};

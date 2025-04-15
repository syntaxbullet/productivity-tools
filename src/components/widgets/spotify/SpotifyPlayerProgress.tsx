import React from 'react';
import { cn } from '@/lib/utils';

interface SpotifyPlayerProgressProps {
  progressMs: number;
  durationMs: number;
  onSeek?: (ms: number) => void;
}

export const SpotifyPlayerProgress: React.FC<SpotifyPlayerProgressProps> = ({
  progressMs,
  durationMs,
  onSeek,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSeek) {
      onSeek(Number(e.target.value));
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <input
        type="range"
        min={0}
        max={durationMs}
        value={progressMs}
        onChange={handleChange}
        onPointerDown={(e) => e.stopPropagation()}
        className={cn(
          'w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer dark:bg-gray-700',
          'accent-primary'
        )}
      />
      <div className="flex justify-between w-full text-xs text-gray-400 mt-1">
        <span>{formatMs(progressMs)}</span>
        <span>{formatMs(durationMs)}</span>
      </div>
    </div>
  );
};

function formatMs(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

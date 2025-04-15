import React from 'react';
import { Button } from '@/components/ui/button';
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface SpotifyPlayerControlsProps {
  paused: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
  disabled?: boolean;
}

export const SpotifyPlayerControls: React.FC<SpotifyPlayerControlsProps> = ({
  paused,
  onPlayPause,
  onPrev,
  onNext,
  volume,
  isMuted,
  onVolumeChange,
  onMute,
  disabled = false,
}) => (
  <div className="flex flex-col gap-2 w-full justify-center items-center mt-2">
    <div className="flex gap-4 justify-center">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrev}
        disabled={disabled}
        aria-label="Previous"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <SkipBack />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onPlayPause}
        disabled={disabled}
        aria-label={paused ? 'Play' : 'Pause'}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {paused ? <Play /> : <Pause />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={disabled}
        aria-label="Next"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <SkipForward />
      </Button>
    </div>
    <div className="flex items-center gap-2 w-full mt-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        className="text-muted-foreground hover:text-foreground"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {isMuted ? <VolumeX /> : <Volume2 />}
      </Button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        onPointerDown={(e) => e.stopPropagation()}
        className="w-full accent-primary bg-muted h-2 rounded-lg appearance-none cursor-pointer"
        style={{ accentColor: 'var(--primary)' }}
        aria-label="Volume"
      />
    </div>
  </div>
);

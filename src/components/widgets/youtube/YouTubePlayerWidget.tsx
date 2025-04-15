import React, { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import { GenericWidget } from '../GenericWidget';
import { useWidgetStore } from '@/stores/WidgetStore';
import { Play, Pause, Square, SkipBack, SkipForward } from 'lucide-react';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';

function extractVideoId(urlOrId: string): string {
  const urlPattern = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = urlOrId.match(urlPattern);
  if (match && match[1]) {
    return match[1];
  }
  return urlOrId;
}

function extractPlaylistId(urlOrId: string): string | null {
  const playlistPattern = /[?&]list=([a-zA-Z0-9_-]+)/;
  const match = urlOrId.match(playlistPattern);
  if (match && match[1]) {
    return match[1];
  }
  // If input looks like a playlist ID (usually 18+ chars alphanumeric with - or _), return it directly
  if (/^[a-zA-Z0-9_-]{18,}$/.test(urlOrId)) {
    return urlOrId;
  }
  return null;
}

interface YouTubePlayerWidgetProps {
  id: string;
  type: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

const YouTubePlayerWidget: React.FC<YouTubePlayerWidgetProps> = ({
  id,
  type,
  minWidth = 320,
  maxWidth = 640,
  minHeight = 180,
  maxHeight = 360,
}) => {
  const widget = useWidgetStore((state) => state.widgets[id]);
  const updateWidgetData = useWidgetStore((state) => state.updateWidgetData);

  const videoIdRaw = widget?.data?.videoId ?? '';
  const videoId = extractVideoId(videoIdRaw);
  const playlistId = extractPlaylistId(videoIdRaw);

  const width = widget?.size?.width ?? minWidth;
  const height = widget?.size?.height ?? minHeight;

  const [inputValue, setInputValue] = useState(videoIdRaw);

  const { iframeRef, isPlaying, play, pause, stop, skipNext, skipPrevious } =
    useYouTubePlayer(videoId, playlistId, width, height);

  useEffect(() => {
    setInputValue(videoIdRaw);
  }, [videoIdRaw]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const newInputValue = inputValue.trim();
    if (newInputValue && newInputValue !== videoIdRaw) {
      updateWidgetData(id, { videoId: newInputValue });
    }
  };

  return (
    <GenericWidget
      id={id}
      type={type}
      minWidth={minWidth}
      maxWidth={maxWidth}
      minHeight={minHeight}
      maxHeight={maxHeight}
    >
      <div className="flex flex-col items-center justify-center h-full p-2 select-none space-y-2">
        <input
          type="text"
          className="w-full px-2 py-1 border rounded"
          placeholder="Enter YouTube video URL or ID"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const newInputValue = inputValue.trim();
              if (newInputValue && newInputValue !== videoIdRaw) {
                updateWidgetData(id, { videoId: newInputValue });
              }
            }
          }}
        />
        <div ref={iframeRef} className="max-w-5/6" />
        <div className="flex space-x-2">
          {playlistId && (
            <Button
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={() => {
                skipPrevious();
              }}
              variant="outline"
              size="icon"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
          )}
          {!isPlaying ? (
            <Button
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={() => {
                play();
              }}
              variant="outline"
              size="icon"
            >
              <Play className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={() => {
                pause();
              }}
              variant="outline"
              size="icon"
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}
          <Button
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={() => {
              stop();
            }}
            variant="outline"
            size="icon"
          >
            <Square className="w-4 h-4" />
          </Button>
          {playlistId && (
            <Button
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={() => {
                skipNext();
              }}
              variant="outline"
              size="icon"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </GenericWidget>
  );
};

export default YouTubePlayerWidget;

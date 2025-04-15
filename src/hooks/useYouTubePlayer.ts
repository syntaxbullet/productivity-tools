import { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function useYouTubePlayer(
  videoId: string,
  playlistId: string | null,
  width: number,
  height: number
) {
  const playerRef = useRef<any | null>(null);
  const iframeRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const onPlayerReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const onPlayerStateChange = useCallback((event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (
      event.data === window.YT.PlayerState.PAUSED ||
      event.data === window.YT.PlayerState.ENDED
    ) {
      setIsPlaying(false);
    }
  }, []);

  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };
    } else {
      setApiReady(true);
    }
  }, []);

  useEffect(() => {
    if (!apiReady) return;

    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    if (iframeRef.current) {
      const playerOptions: any = {
        height: height.toString(),
        width: width.toString(),
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
        playerVars: {
          controls: 0,
          modestbranding: 1,
        },
      };
      if (playlistId) {
        playerOptions.playerVars.listType = 'playlist';
        playerOptions.playerVars.list = playlistId;
        playerOptions.playerVars.playlist = playlistId;
      } else {
        playerOptions.videoId = videoId;
      }
      playerRef.current = new window.YT.Player(
        iframeRef.current,
        playerOptions
      );
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [apiReady, videoId, playlistId, onPlayerReady, onPlayerStateChange]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setSize(width, height);
    }
  }, [width, height]);

  // Remove width and height from dependencies to avoid recreating player on resize
  // Instead, only recreate player when apiReady, videoId, or playlistId change
  useEffect(() => {
    if (!apiReady) return;

    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    if (iframeRef.current) {
      const playerOptions: any = {
        height: height.toString(),
        width: width.toString(),
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
        playerVars: {
          controls: 0,
          modestbranding: 1,
        },
      };
      if (playlistId) {
        playerOptions.playerVars.listType = 'playlist';
        playerOptions.playerVars.list = playlistId;
        playerOptions.playerVars.playlist = playlistId;
      } else {
        playerOptions.videoId = videoId;
      }
      playerRef.current = new window.YT.Player(
        iframeRef.current,
        playerOptions
      );
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [apiReady, videoId, playlistId, onPlayerReady, onPlayerStateChange]);

  useEffect(() => {
    if (playerRef.current && isReady) {
      setIsPlaying(false);
      if (playlistId && typeof playerRef.current.loadPlaylist === 'function') {
        playerRef.current.loadPlaylist({
          listType: 'playlist',
          list: playlistId,
        });
      } else if (typeof playerRef.current.loadVideoById === 'function') {
        playerRef.current.loadVideoById(videoId);
      }
    }
  }, [videoId, playlistId, isReady]);

  const play = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.playVideo();
    }
  }, [isReady]);

  const pause = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.pauseVideo();
    }
  }, [isReady]);

  const stop = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.stopVideo();
    }
  }, [isReady]);

  const skipNext = useCallback(() => {
    if (
      playerRef.current &&
      isReady &&
      typeof playerRef.current.nextVideo === 'function'
    ) {
      playerRef.current.nextVideo();
    } else {
      console.warn('nextVideo method not available');
    }
  }, [isReady]);

  const skipPrevious = useCallback(() => {
    if (
      playerRef.current &&
      isReady &&
      typeof playerRef.current.previousVideo === 'function'
    ) {
      playerRef.current.previousVideo();
    } else {
      console.warn('previousVideo method not available');
    }
  }, [isReady]);

  return {
    iframeRef,
    isPlaying,
    play,
    pause,
    stop,
    skipNext,
    skipPrevious,
  };
}

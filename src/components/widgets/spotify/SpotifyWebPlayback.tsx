import React, { useEffect, useRef, useState } from 'react';
import { SpotifyPlayerControls } from './SpotifyPlayerControls';
import { SpotifyPlayerProgress } from './SpotifyPlayerProgress';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

interface Track {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  duration_ms: number;
}

// --- Global Player Instance to Prevent Duplicate Devices ---
function getOrCreateSpotifyPlayer(
  token: string,
  volume: number,
  setDeviceId: (id: string) => void,
  setError: (msg: string) => void,
  setPaused: (b: boolean) => void,
  setProgressMs: (n: number) => void,
  setDurationMs: (n: number) => void,
  setTrack: (t: Track | null) => void
) {
  if (typeof window === 'undefined') return null;
  // Always disconnect any existing player on reload/mount
  if ((window as any).__SPOTIFY_PLAYER__) {
    try {
      (window as any).__SPOTIFY_PLAYER__.disconnect();
    } catch {}
    delete (window as any).__SPOTIFY_PLAYER__;
  }
  const player = new window.Spotify.Player({
    name: 'Productivity Tools',
    getOAuthToken: (cb: (token: string) => void) => {
      cb(token);
    },
    volume,
  });
  (window as any).__SPOTIFY_PLAYER__ = player;

  player.addListener('ready', ({ device_id }: any) => {
    setDeviceId(device_id);
  });
  player.addListener('initialization_error', ({ message }: any) =>
    setError(message)
  );
  player.addListener('authentication_error', ({ message }: any) =>
    setError(message)
  );
  player.addListener('account_error', ({ message }: any) => setError(message));
  player.addListener('playback_error', ({ message }: any) => setError(message));
  player.addListener('player_state_changed', (state: any) => {
    setPaused(state.paused);
    setProgressMs(state.position);
    setDurationMs(state.duration);
    if (state.track_window?.current_track) {
      setTrack(state.track_window.current_track);
    }
  });
  player.connect();
  return player;
}

export const SpotifyWebPlayback: React.FC<{
  token: string;
  uris: string[];
}> = ({ token }) => {
  const playerRef = useRef<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [paused, setPaused] = useState(true);
  const [track, setTrack] = useState<Track | null>(null);
  const [progressMs, setProgressMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // Track last played URI to avoid duplicate play requests

  // Fetch current track info

  useEffect(() => {
    function createPlayer() {
      playerRef.current = getOrCreateSpotifyPlayer(
        token,
        volume,
        (id: string) => {
          setDeviceId(id);
          setInitializing(false);
          console.log('Spotify device ready:', id);
        },
        (msg: string) => {
          setError(msg);
          setInitializing(false);
          console.error('Spotify initialization error:', msg);
        },
        setPaused,
        setProgressMs,
        setDurationMs,
        setTrack
      );
    }
    if ((window as any).Spotify) {
      createPlayer();
    } else {
      (window as any).onSpotifyWebPlaybackSDKReady = createPlayer;
      // Inject SDK script if not present
      if (!document.getElementById('spotify-sdk')) {
        const script = document.createElement('script');
        script.id = 'spotify-sdk';
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
    // Cleanup: disconnect player on unmount
    return () => {
      if (playerRef.current) playerRef.current.disconnect();
    };
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    const savedVolume = localStorage.getItem('spotify_player_volume');
    const savedMuted = localStorage.getItem('spotify_player_muted');
    if (savedVolume !== null) setVolume(Number(savedVolume));
    if (savedMuted !== null) setIsMuted(savedMuted === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('spotify_player_volume', String(volume));
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('spotify_player_muted', String(isMuted));
  }, [isMuted]);

  // --- Smooth progress bar update ---
  useEffect(() => {
    if (!track || paused) return;
    const interval = setInterval(() => {
      setProgressMs((prev) => {
        // Only increment if less than duration
        if (prev + 200 < durationMs) {
          return prev + 200;
        } else {
          return durationMs;
        }
      });
    }, 200);
    return () => clearInterval(interval);
  }, [track, paused, durationMs]);

  // Controls
  const handlePlayPause = () => {
    if (!playerRef.current) return;
    playerRef.current.togglePlay();
  };

  const handleNext = () => {
    if (!playerRef.current) return;
    playerRef.current.nextTrack();
  };

  const handlePrev = () => {
    if (!playerRef.current) return;
    playerRef.current.previousTrack();
  };

  const handleSeek = (ms: number) => {
    if (!playerRef.current) return;
    playerRef.current.seek(ms);
    setProgressMs(ms);
  };

  const handleMute = () => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (playerRef.current) playerRef.current.setVolume(newMuted ? 0 : volume);
      return newMuted;
    });
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4 w-full max-w-xs mx-auto text-card-foreground">
      {/* Device status indicator */}
      {initializing && (
        <span className="text-yellow-500 text-xs mb-2">
          Initializing Spotify device…
        </span>
      )}
      {deviceId && !error && !initializing && (
        <span className="text-green-600 text-xs mb-2">
          Device ready: {deviceId}
        </span>
      )}
      {error && (
        <span className="text-red-500 text-xs mb-2">Error: {error}</span>
      )}
      {!track && !initializing && !error && (
        <div className="text-center text-yellow-600 dark:text-yellow-400 text-xs mt-2">
          No active playback device found.
          <br />
          <span className="text-muted-foreground">
            Open Spotify and select "Productivity Tools" as the active device.
            <br />
            <b>Tip:</b> Click Play to activate the Spotify device if it doesn't
            appear.
          </span>
        </div>
      )}
      {track && (
        <div className="flex flex-col items-center w-full">
          <img
            src={track.album.images[0]?.url}
            alt={track.name}
            className="w-28 h-28 rounded shadow mb-2 border border-muted"
            style={{ background: 'var(--muted)' }}
          />
          <div className="font-semibold text-center text-base text-foreground">
            {track.name}
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {track.artists.map((a) => a.name).join(', ')}
          </div>
        </div>
      )}
      <SpotifyPlayerProgress
        progressMs={progressMs}
        durationMs={durationMs}
        onSeek={handleSeek}
      />
      <SpotifyPlayerControls
        paused={paused}
        onPlayPause={handlePlayPause}
        onPrev={handlePrev}
        onNext={handleNext}
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={(vol) => {
          setVolume(vol);
          if (playerRef.current) playerRef.current.setVolume(vol);
        }}
        onMute={handleMute}
        disabled={!track}
      />
    </div>
  );
};

import React from 'react';
import { GenericWidget } from '../GenericWidget';
import { useWidgetStore } from '../../../stores/WidgetStore';
import { SpotifyEmbed } from './SpotifyEmbed';
import { SpotifyLoginButton } from './SpotifyLoginButton';
import { SpotifyWebPlayback } from './SpotifyWebPlayback';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const SpotifyPlayerWidget: React.FC<{
  id: string;
  type: string;
  data?: any;
}> = ({ id, type }) => {
  // Always get the latest widget data from the store
  const widgetData = useWidgetStore((state) => state.widgets[id]?.data || {});

  // Only allow playback if we have a valid Spotify access token and URI
  const accessToken =
    typeof window !== 'undefined'
      ? localStorage.getItem('spotify_access_token')
      : null;
  const defaultSpotifyUrl =
    'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC'; // Rick Astley - Never Gonna Give You Up
  const spotifyUri = widgetData.spotifyUrl
    ? extractSpotifyUri(widgetData.spotifyUrl)
    : extractSpotifyUri(defaultSpotifyUrl);

  // Add a window bridge to allow child to update widget data
  if (typeof window !== 'undefined') {
    (window as any).__WIDGET_ID__ = id;
    (window as any).__UPDATE_WIDGET_DATA__ =
      useWidgetStore.getState().updateWidgetData;
  }

  const handleSignOut = () => {
    localStorage.removeItem('spotify_access_token');
    // Optionally disconnect player
    if (typeof window !== 'undefined' && (window as any).__SPOTIFY_PLAYER__) {
      try {
        (window as any).__SPOTIFY_PLAYER__.disconnect();
      } catch {}
      delete (window as any).__SPOTIFY_PLAYER__;
    }
    window.location.reload();
  };

  return (
    <GenericWidget id={id} type={type} data={widgetData}>
      <div className="relative w-full h-full flex flex-col items-center gap-2 justify-center">
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={handleSignOut}
          title="Sign out of Spotify"
          aria-label="Sign out of Spotify"
          disabled={!accessToken}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <LogOut className="w-4 h-4" />
        </Button>
        <div className="flex flex-col items-center gap-2 justify-center w-full h-full">
          {!accessToken && <SpotifyLoginButton />}
          {accessToken && spotifyUri && (
            <SpotifyWebPlayback token={accessToken} uris={[spotifyUri]} />
          )}
          {!accessToken && widgetData.spotifyUrl && (
            <SpotifyEmbed url={widgetData.spotifyUrl} />
          )}
        </div>
      </div>
    </GenericWidget>
  );
};

function extractSpotifyUri(url: string): string | null {
  // Handles track, album, playlist, artist
  const regex =
    /open\.spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  if (match && match[1] && match[2]) {
    return `spotify:${match[1]}:${match[2]}`;
  }
  return null;
}

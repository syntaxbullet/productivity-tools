import React from 'react';
import { redirectToSpotifyAuth } from '@/lib/spotifyAuth';
import { Button } from '@/components/ui/button';

export const SpotifyLoginButton: React.FC = () => (
  <Button
    onClick={() => {
      console.log('Redirecting to Spotify login...');
      redirectToSpotifyAuth();
    }}
    onPointerDown={(e) => e.stopPropagation()}
  >
    Connect Spotify
  </Button>
);

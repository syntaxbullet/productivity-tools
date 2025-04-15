import React, { useEffect } from 'react';
import { fetchSpotifyToken } from '@/lib/spotifyAuth';

const SpotifyCallback: React.FC = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      fetchSpotifyToken(code)
        .then((tokenData) => {
          localStorage.setItem('spotify_access_token', tokenData.access_token);
          // Optionally store refresh_token, expires_in, etc.
          window.location.replace('/'); // Redirect to app
        })
        .catch(console.error);
    }
  }, []);
  return <div>Connecting to Spotify...</div>;
};
export default SpotifyCallback;

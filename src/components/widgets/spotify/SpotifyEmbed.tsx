import React from 'react';

function extractSpotifyEmbedUrl(url: string): string | null {
  // Handles track, album, playlist, artist
  const regex =
    /(?:open\.spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+))/;
  const match = url.match(regex);
  if (match && match[1] && match[2]) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`;
  }
  return null;
}

export const SpotifyEmbed: React.FC<{ url: string }> = ({ url }) => {
  const embedUrl = extractSpotifyEmbedUrl(url);
  if (!embedUrl) {
    return <div className="text-red-500">Invalid Spotify URL</div>;
  }
  return (
    <iframe
      src={embedUrl}
      width="100%"
      height="152"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      className="rounded-lg shadow"
      title="Spotify Player"
    ></iframe>
  );
};

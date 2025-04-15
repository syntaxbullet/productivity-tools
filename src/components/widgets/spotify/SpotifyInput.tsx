import React, { useState } from 'react';

interface SpotifyInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export const SpotifyInput: React.FC<SpotifyInputProps> = ({
  value,
  onChange,
  onSubmit,
}) => {
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !/^https:\/\/open\.spotify\.com\/(track|playlist|album|artist)\//.test(
        value
      )
    ) {
      setError(
        'Please enter a valid Spotify track, playlist, album, or artist URL.'
      );
      return;
    }
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Paste Spotify track or playlist link"
        value={value}
        onChange={handleInputChange}
        className="input input-bordered w-full"
      />
      <button
        type="submit"
        className="btn btn-primary w-full"
        onPointerOver={(e) => e.stopPropagation()}
      >
        Load
      </button>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </form>
  );
};

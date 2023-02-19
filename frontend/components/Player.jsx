import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(true), [trackUri]);

  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      token={accessToken}
      callback={(state) => {
        if (!state.isPlaying) {
          setPlay(false);
        }
      }}
      styles={{
        activeColor: "#ffffff",
        bgColor: "#191414",
        color: "#1db954",
        loaderColor: "#1db954",
        sliderColor: "#1db954",
        trackArtistColor: "#ccc",
        height: 60,
        trackNameColor: "#ffffff",
        sliderHandleColor: "#1db954",
        sliderHeight: 3,
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
    />
  );
}

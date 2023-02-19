import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { GlobalStyle } from "./styles/index.js";
import { logout, accessToken } from "./spotify.js";
import {
  Login,
  Profile,
  TopArtists,
  TopTracks,
  Playlists,
  Playlist,
  Artist,
} from "./pages/index.js";
import { Player } from "./components/index.js";

import styled from "styled-components/dist/styled-components";

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}



/***
 * Main application entry point
 * @returns {JSX.Element}
 * @constructor
 */
const App = () => {
  const data = window.localStorage.getItem("user");

  const [playingTrack, setPlayingTrack] = useState(null);
  const access_token = accessToken;

  function chooseTrack(track) {
    setPlayingTrack(track);
  }

  return (
    <div>
      <GlobalStyle />

      {!access_token ? (
        <Login />
      ) : (
        <>
          <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/top-artists" element={<TopArtists />} />
              <Route
                path="/artist/:id"
                element={<Artist chooseTrack={chooseTrack} />}
              />
              <Route
                path="/top-tracks"
                element={<TopTracks chooseTrack={chooseTrack} />}
              />

              <Route
                path="/playlists/:id"
                element={<Playlist chooseTrack={chooseTrack} />}
              />

              <Route path="/playlists" element={<Playlists />} />

              <Route path="/" element={<Profile chooseTrack={chooseTrack} />} />
            </Routes>
          </Router>
        </>
      )}
      <StyledPlayer>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </StyledPlayer>
    </div>
  );
};

const StyledApp = styled.div`
  height: 100%;
`;
const StyledPlayer = styled.div`
  position: fixed;
  width: 100%;
  background-color: #fff;
  bottom: 0;
`;
export default App;

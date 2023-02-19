import styled from "styled-components/dist/styled-components";

const StyledLoginContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledLoginButton = styled.a`
  display: inline-block;
  background-color: var(--green);
  color: var(--white);
  border-radius: var(--border-radius-pill);
  font-weight: 700;
  font-size: var(--fz-lg);
  padding: var(--spacing-md) var(--spacing-xl);
  margin: 10px;

  &:hover,
  &:focus {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;

// Map for localStorage keys
const LOCALSTORAGE_KEYS = {
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
  spotifyId: "spotifyId",
  expireTime: "spotify_token_expire_time",
  timestamp: "spotify_token_timestamp",
};

// Map to retrieve localStorage values
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
  spotifyId: window.localStorage.getItem(LOCALSTORAGE_KEYS.spotifyId),
  name: window.localStorage.getItem(LOCALSTORAGE_KEYS.name),
};

const LOGIN_URI = "http://localhost:8080/v1/login";

const Login = ({}) => {
  return (
    <div>
      <div>
        <StyledLoginContainer>
          <StyledLoginButton href={LOGIN_URI}>
            Log in to Spotify
          </StyledLoginButton>
        </StyledLoginContainer>
      </div>
    </div>
  );
};

export default Login;

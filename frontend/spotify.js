import axios from "axios";

// Map for localStorage keys
const LOCALSTORAGE_KEYS = {
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
  expireTime: "spotify_token_expire_time",
  timestamp: "spotify_token_timestamp",
  name: "spotify_user_name",
  loggedInBefore: "spotify_logged_in_before",
};

// Map to retrieve localStorage values
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
  name: window.localStorage.getItem(LOCALSTORAGE_KEYS.name),
  loggedInBefore: window.localStorage.getItem[LOCALSTORAGE_KEYS.loggedInBefore],
};

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(timestamp);
  return millisecondsElapsed / 1000 > Number(expireTime);
};

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
const refreshToken = async () => {
  try {
    // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
    if (
      !LOCALSTORAGE_VALUES.refreshToken ||
      LOCALSTORAGE_VALUES.refreshToken === "undefined" ||
      Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000 < 1000
    ) {
      console.error("No refresh token available");
      logout();
    }

    // Use `/refresh_token` endpoint from our Node app
    const { data } = await axios.get(
      `/v1/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`
    );
    console.log(data);
    console.log(LOCALSTORAGE_KEYS.accessToken);
    if (data && data.spotify_access_token !== undefined) {
      console.log("here");
      // Update localStorage values
      window.localStorage.setItem(
        LOCALSTORAGE_KEYS.accessToken,
        data.spotify_access_token
      );
      window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
      // Reload the page for localStorage updates to be reflected
      window.location.reload();
    }
  } catch (e) {
    console.error(e);
  }
};

/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = () => {
  // Clear all localStorage items
  window.localStorage.removeItem(LOCALSTORAGE_KEYS.accessToken);
  window.localStorage.removeItem(LOCALSTORAGE_KEYS.expireTime);
  window.localStorage.removeItem(LOCALSTORAGE_KEYS.refreshToken);
  window.localStorage.removeItem(LOCALSTORAGE_KEYS.timestamp);
  window.localStorage.setItem(LOCALSTORAGE_KEYS.loggedInBefore, true);
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }

  // Navigate to homepage
  window.location = window.location.origin;
};
/**
 * Handles logic for retrieving the Spotify access token from localStorage
 * or URL query params
 * @returns {string} A Spotify access token
 */
const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  console.log(urlParams.get("expires_in"));
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expires_in"),
  };
  const hasError = urlParams.get("error");

  // If there's an error OR the token in localStorage has expired, refresh the token
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.accessToken === "undefined"
  ) {
    refreshToken();
  }

  // If there is a valid access token in localStorage, use that
  if (
    LOCALSTORAGE_VALUES.accessToken &&
    LOCALSTORAGE_VALUES.accessToken !== "undefined"
  ) {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  // If there is a token in the URL query params, user is logging in for the first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    // Store the query params in localStorage
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }
    // Set timestamp
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

    //change the url to the default origin
    window.history.pushState({}, document.title, window.location.origin);
    // Return access token from query params
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  // We should never get here!
  return false;
};

export const accessToken = getAccessToken();

/**
 * Axios global request headers
 * https://github.com/axios/axios#global-axios-defaults
 */
axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
axios.defaults.headers["Content-Type"] = "application/json";

/**
 * Get Current User's Profile
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-current-users-profile
 * @returns {Promise}
 */
export const getCurrentUserProfile = () => axios.get("/me");

/**
 * Get a User's profile
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-profile
 * @param {string} userId - The user's Spotify user ID.
 * @returns {Promise}
 */
export const getUserProfile = (userId) => axios.get(`/users/${userId}`);

/**
 * Get a List of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-list-of-current-users-playlists
 * @returns {Promise}
 */
export const getCurrentUserPlaylists = (limit = 20) => {
  return axios.get(`/me/playlists?limit=${limit}`);
};

/**
 * Get a List of a User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-list-users-playlists
 * @param {string} userId - The user's Spotify user ID.
 * @param {number} limit - The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset - The index of the first item to return. Default: 0 (the first object). Use with limit to get the next set of items.
 * @returns {Promise}
 */
export const getUserPlaylists = (userId, limit = 20, offset = 0) => {
  return axios.get(
    `/users/${userId}/playlists?limit=${limit}&offset=${offset}`
  );
};

/**
 * Get a User's Top Artists
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
 * @param {string} time_range - 'short_term' (last 4 weeks) 'medium_term' (last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Defaults to 'short_term'
 * @returns {Promise}
 */
export const getTopArtists = (time_range = "short_term") => {
  return axios.get(`/me/top/artists?time_range=${time_range}`);
};

/**
 * Get a User's Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
 * @param {string} time_range - 'short_term' (last 4 weeks) 'medium_term' (last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Defaults to 'short_term'
 * @returns {Promise}
 */
export const getTopTracks = (time_range = "short_term") => {
  return axios.get(`/me/top/tracks?time_range=${time_range}`);
};

/**
 * Gets the avialbe devices that are connected to the user.
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-users-available-devices
 * @param {string} time_range - 'short_term' (last 4 weeks) 'medium_term' (last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Defaults to 'short_term'
 * @returns {Promise}
 */
export const getAvailableDevices = () => {
  return axios.get(`/me/player/devices`);
};

/**
 * Get a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-playlist
 * @param {string} playlist_id - The Spotify ID for the playlist.
 * @returns {Promise}
 */
export const getPlaylistById = (playlist_id) => {
  return axios.get(`/playlists/${playlist_id}`);
};

/**
 * Get an artist by an id
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artist
 * @param {string} artist_id - The Spotify ID for the artist.
 * @returns {Promise}
 */
export const getArtistById = (artist_id) => {
  return axios.get(`/artists/${artist_id}`);
};

/**
 * Get the top tracks of an artist by an id
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artist
 * @param {string} artist_id - The Spotify ID for the artist.
 * @returns {Promise}
 */
export const getTopTracksById = (artist_id) => {
  return axios.get(`/artists/${artist_id}/top-tracks?market=US`);
};

/**
 * Gets the albums from the artist by an id
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-albums
 * @param {string} artist_id - The Spotify ID for the artist.
 * @returns {Promise}
 */
export const getArtistAlbumById = (artist_id) => {
  return axios.get(`/artists/${artist_id}/albums?limit=50&market=US`);
};

/**
 * Get Audio Features for Several Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-several-audio-features
 * @param {string} ids - A comma-separated list of the Spotify IDs for the tracks
 * @returns {Promise}
 */
export const getAudioFeaturesForTracks = (ids) => {
  return axios.get(`/audio-features?ids=${ids}`);
};

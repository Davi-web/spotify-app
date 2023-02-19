import { formatDuration } from "../utils/index.js";
import { StyledTrackList } from "../styles/index.js";

const TrackList = ({ tracks, chooseTrack }) => {
  const handlePlay = (track) => {
    chooseTrack(track);
  };
  return (
    <>
      {tracks && tracks.length ? (
        <StyledTrackList>
          {tracks.map((track, i) => {
            return track !== null ? (
              <li
                className="track__item"
                key={i}
                onDoubleClick={() => {
                  handlePlay(track);
                  //add tracks here NEED TO IMPLEMENT
                }}
              >
                <div className="track__item__num">{i + 1}</div>
                <div className="track__item__title-group">
                  {track.album.images.length && track.album.images[2] && (
                    <div className="track__item__img">
                      <img
                        src={track.album.images[2].url}
                        alt={track.name}
                        height={40}
                        width={40}
                      />
                    </div>
                  )}
                  <div className="track__item__name-artist">
                    <div className="track__item__name overflow-ellipsis">
                      {track.name}
                    </div>
                    <div className="track__item__artist overflow-ellipsis">
                      {track.artists.map((artist, i) => (
                        <span key={i}>
                          {artist.name}
                          {i !== track.artists.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="track__item__album overflow-ellipsis">
                  {track.album.name}
                </div>
                <div className="track__item__duration">
                  {formatDuration(track.duration_ms)}
                </div>
              </li>
            ) : (
              <li className="track__item" key={i}>
                <div className="track__item__num">{i + 1}</div>
                <div className="track__item__title-group">
                  <div className="track__item__img">
                    <img
                      src={require("../pictures/default.png")}
                      alt="default_photo"
                      width={40}
                      height={40}
                    />
                  </div>

                  <div className="track__item__name-artist">
                    <div className="track__item__name overflow-ellipsis">
                      Couldn't find info for track {i + 1} because it is null
                    </div>
                  </div>
                </div>
                <div className="track__item__album overflow-ellipsis">
                  Couldn't find artist for {i + 1}
                </div>
                <div className="track__item__duration">0:00</div>
              </li>
            );
          })}
        </StyledTrackList>
      ) : (
        <p className="empty-notice">No tracks available</p>
      )}
    </>
  );
};
export default TrackList;

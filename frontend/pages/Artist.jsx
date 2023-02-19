import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { TrackList, SectionWrapper } from "../components/index.js";
import {
  getArtistById,
  getTopTracksById,
  getArtistAlbumById,
} from "../spotify.js";
import { StyledHeader, StyledSection } from "../styles/index.js";
import { catchErrors } from "../../shared/index.js";
const Artist = ({ chooseTrack }) => {
  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [albumsArray, setAlbumsArray] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getArtistById(id);
        setProfile(data);
        const tracks = await getTopTracksById(id);
        setTopTracks(tracks.data);
        const tempAlbums = await getArtistAlbumById(id);
        setAlbums(tempAlbums.data.items);

      } catch(err) {
        console.log(err);
      }
     
    };

    catchErrors(fetchData());
    const tempArr = obj(albums);
    setAlbumsArray(tempArr);

    // objectToArray();
  }, [id]);
  // const objectToArray = Object.keys(albums ? albums : []) // get all object properties as an array
  //   .map(function (k) {
  //     // iterate and generate new array with custom element
  //     return {
  //       // generate custom array object based on the property and object and return
  //       id: albums[k]?.id, // k is property of ov=bjeck
  //       name: albums[k]?.name, // get inner properties from albums object using k
  //       images: albums[k]?.images,
  //     };
  //   });
  const obj = (albums) => {
    let arr = [];
    if (albums) {
      for (const [key, values] of Object.entries(albums)) {
        arr.push(values);
      }
    }
    return arr;
  };

  // console.log(typeof albumsForTracklist ? albumsForTracklist : "");
  // const albumsForTracklist = useMemo(() => {
  //   if (!albums) {
  //     return;
  //   }

  //   return albums?.map(({ album }) => album);
  // }, [albums]);
  // console.log(albumsArray);

  return (
    <div>
      <StyledHeader type="user">
        <div className="header__inner">
          {profile?.images.length && profile?.images[0].url && (
            <img
              className="header__img"
              src={profile.images[0].url}
              alt="Avatar"
             
            />
          )}
          <div>
            <div className="header__overline">Profile</div>
            <h1 className="header__name">{profile?.name}</h1>
            <p className="header__meta">
              {/* {playlists && (
                    <span>
                      {playlists.total} Playlist
                      {playlists.total !== 1 ? "s" : ""}
                    </span>
                  )} */}
              <span>
                {profile?.followers.total.toLocaleString("en-US")} Total
                Follower
                {profile?.followers.total !== 1 ? "s" : ""}
              </span>
            </p>
          </div>
        </div>
      </StyledHeader>
      <main>
        <SectionWrapper title="Playlist" breadcrumb={true}>
          {topTracks && (
            <TrackList tracks={topTracks.tracks} chooseTrack={chooseTrack} />
          )}
        </SectionWrapper>
      </main>
      <StyledSection>
        {/* <TrackList tracks={albums?.items} chooseTrack={chooseTrack} /> */}
      </StyledSection>
    </div>
  );
};

export default Artist;

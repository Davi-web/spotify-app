import { useState, useEffect } from "react";
import { getTopTracks } from "../spotify.js";
import { catchErrors } from "../../shared/index.js";
import {
  SectionWrapper,
  TrackList,
  TimeRangeButtons,
  Loader
} from "../components/index.js";

const TopTracks = ({ chooseTrack }) => {
  const [topTracks, setTopTracks] = useState(null);
  const [activeRange, setActiveRange] = useState("short");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTopTracks(`${activeRange}_term`);

      setTopTracks(data);
    };

    catchErrors(fetchData());
  }, [activeRange]);

  return (
    <main>
      <SectionWrapper title="Top Tracks" breadcrumb={true}>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {topTracks && topTracks.items ? (
          <TrackList tracks={topTracks.items} chooseTrack={chooseTrack} />
        ) : (
          <Loader/>
        )}
      </SectionWrapper>
    </main>
  );
};

export default TopTracks;

import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import Header from "../components/Common/Header";
import Button from "../components/Common/Button";
import EpisodeDetails from "../components/Podcasts/EpisodeDetails";
import AudioPlayer from "../components/Podcasts/AudioPlayer";
import Loader from "../components/Common/Loader";

function PodcastDetails() {
  const [podcastDetails, setPodcastDetails] = useState();
  const [episodes, setEpisodes] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [audioPlayingFile, setAudioPlayingFile] = useState("");

  const loaderStyle = {
    display: "flex",
    width: "100vw",
    height: "70vh",
    justifyContent: "center",
    alignItems: "center",
  };

  useEffect(() => {
    fetchPodcastDetails();
  }, []);

  // fetching all episodes

  useEffect(() => {
    const unSubscribe = onSnapshot(
      query(collection(db, "podcasts", id, "episodes")),
      (querySnapshot) => {
        if (querySnapshot.empty) {
          return;
        }
        const allEpisodes = [];
        querySnapshot.forEach((doc) => {
          allEpisodes.push({ id: doc.id, ...doc.data() });
        });
        setEpisodes(allEpisodes);
      },
      (error) => {
        toast.error(error.message);
      }
    );
    return () => {
      unSubscribe();
    };
  }, []);

  // fetching podcast details

  async function fetchPodcastDetails() {
    const docRef = doc(db, `podcasts`, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPodcastDetails(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("No such document!");
      toast.error("Podcast either has been deleted or does not exists!");
      navigate("/podcasts");
    }
  }

  function createEpisode() {
    navigate(`/podcasts/${id}/create-episode`);
  }

  return (
    <div>
      <Header />
      {podcastDetails ? (
        <div className="podcast-details-wrapper">
          <div className="podcast-details-title-div">
            <h1>{podcastDetails.title}</h1>
            {podcastDetails.createdBy == auth.currentUser.uid && (
              <Button text={"Create Episode"} onClick={createEpisode} />
            )}
          </div>
          <div className="podcast-details-banner-div">
            <img
              src={podcastDetails.bannerImage}
              alt={podcastDetails.title}
              className="podcast-details-banner-img"
            />
          </div>
          <p className="podcast-details-desc">{podcastDetails.description}</p>
          <h1>Episodes</h1>
          {episodes.length > 0 ? (
            <div>
              {episodes.map((episode, index) => {
                return (
                  <EpisodeDetails
                    key={index}
                    index={index + 1}
                    title={episode.title}
                    description={episode.description}
                    audioFile={episode.audioFile}
                    onClick={(file) => setAudioPlayingFile(file)}
                  />
                );
              })}
            </div>
          ) : (
            <p>No Episodes</p>
          )}
        </div>
      ) : (
        <div style={loaderStyle}>
          <Loader />
        </div>
      )}
      {audioPlayingFile && (
        <>
          <div style={{ marginTop: "4rem" }}></div>
          <AudioPlayer
            title={podcastDetails.title}
            displayImage={podcastDetails.displayImage}
            audioFile={audioPlayingFile}
          />
        </>
      )}
    </div>
  );
}

export default PodcastDetails;

import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setPodcasts } from "../redux/Slices/podcastSlice";
import { toast } from "react-toastify";
import PodcastCard from "../components/Podcasts/PodcastCard";
import InputComponent from "../components/Common/Input";

function PodcastsPage() {
  const dispatch = useDispatch();
  const podcasts = useSelector((state) => state.podcasts.podcasts);
  const [search, setSearch] = useState("");
  // getting podcasts data from firebase and uploading to store

  useEffect(() => {
    const unSubscribe = onSnapshot(
      query(collection(db, "podcasts")),
      (querySnapshot) => {
        if (querySnapshot.empty) {
          return;
        }
        const allPodcasts = [];
        querySnapshot.forEach((doc) => {
          allPodcasts.push({ id: doc.id, ...doc.data() });
        });
        dispatch(setPodcasts(allPodcasts));
      },
      (error) => {
        toast.error(error.message);
      }
    );
    return () => {
      unSubscribe();
    };
  }, [dispatch]);

  const filteredPodcasts = podcasts.filter((podcast) =>
    podcast.title.trim().toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="input-wrapper" style={{ marginTop: "2rem" }}>
        <h1>Discover Podcasts</h1>
        <InputComponent
          type={"text"}
          placeholder={"Search"}
          state={search}
          setState={setSearch}
        />
        <div className="podcasts-cards-container" style={{marginTop:"2rem"}}>
          {filteredPodcasts.length > 0 ? (
            filteredPodcasts.map((podcast) => {
              return (
                <PodcastCard
                  key={podcast.id}
                  title={podcast.title}
                  displayImage={podcast.displayImage}
                  id={podcast.id}
                />
              );
            })
          ) : (
            <h3>{search?"No Podcasts Found!":"No Podcasts Available on the Platform!"}</h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default PodcastsPage;

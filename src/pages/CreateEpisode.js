import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
import InputComponent from "../components/Common/Input";
import Button from "../components/Common/Button";
import FileInput from "../components/Common/Input/FileInput";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Common/Loader";

function CreateEpisode() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [podcastDetails, setPodcastDetails] = useState(null);
  const navigate = useNavigate();

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

  async function fetchPodcastDetails() {
    const docRef = doc(db, `podcasts`, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPodcastDetails(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("No such document!");
      toast.error(
        "Episode cannot be created! The podcast either has been deleted or does not exists!"
      );
      navigate("/podcasts");
    }
  }

  async function handleCreateEpisode() {
    if (title.trim() && desc.trim() && audioFile && id) {
      let toastId;
      try {
        setLoading(true);
        // displaying loading toast
        toastId = toast.loading("Creating Episode...");

        // uploading audio file

        const audioFileRef = ref(
          storage,
          `podcast-episodes/${auth.currentUser.uid}/Audio-${Date.now()}`
        );
        await uploadBytes(audioFileRef, audioFile);
        const audioFileUrl = await getDownloadURL(audioFileRef);

        // saving episode data to firebase db
        const episodeData = {
          title,
          description: desc,
          audioFile: audioFileUrl,
        };
        // console.log(podcastData);
        await addDoc(collection(db, "podcasts", id, "episodes"), episodeData);

        // display success toast
        toast.update(toastId, {
          render: "Episode Created Successfully!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });

        // clearing Input Fields
        setTitle("");
        setDesc("");
        setAudioFile(null);
        setLoading(false);
      } catch (error) {
        if (toastId) {
          toast.update(toastId, {
            render: error.message || "Error occurred",
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
        } else {
          toast.error(error.message || "Error occurred");
        }
        setLoading(false);
        return;
      }
    } else {
      toast.warn("Please fill all the fields!");
      return;
    }
  }

  return (
    <div className="create-episode-div">
      <Header />
      {podcastDetails ? (
        <div className="input-wrapper">
          <h1>Create Episode</h1>
          <InputComponent
            type={"text"}
            placeholder={"Title"}
            state={title}
            setState={setTitle}
            required={true}
          />
          <InputComponent
            type={"text"}
            placeholder={"Description"}
            state={desc}
            setState={setDesc}
            required={true}
          />
          <FileInput
            type={"file"}
            id={"audioFile"}
            accept={"audio/*"}
            text={"Audio File"}
            state={audioFile}
            setState={setAudioFile}
          />
          <Button
            text={loading ? "Creating Episode..." : "Create Episode"}
            disabled={loading}
            onClick={handleCreateEpisode}
          />
        </div>
      ) : (
        <div style={loaderStyle}>
          <Loader />
        </div>
      )}
    </div>
  );
}

export default CreateEpisode;

import React, { useState } from "react";
import InputComponent from "../Common/Input";
import FileInput from "../Common/Input/FileInput";
import Button from "../Common/Button";
import { toast } from "react-toastify";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

function CreatePodcastForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [displayImg, setDisplayImg] = useState(null);
  const [bannerImg, setBannerImg] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleCreatePodcast() {
    if (title.trim() && desc.trim() && displayImg && bannerImg) {
      let toastId;
      try {
        setLoading(true);
        // displaying loading toast
        toastId = toast.loading("Files are uploading...");

        // uploading display image

        const displayImgRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/Display-${Date.now()}`
        );
        await uploadBytes(displayImgRef, displayImg);
        const displayImageUrl = await getDownloadURL(displayImgRef);

        // uploading banner image

        const BannerImgRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/Banner-${Date.now()}`
        );
        await uploadBytes(BannerImgRef, bannerImg);
        const bannerImageUrl = await getDownloadURL(BannerImgRef);

        // saving podcast data to firebase db
        const podcastData = {
          title,
          description: desc,
          bannerImage: bannerImageUrl,
          displayImage: displayImageUrl,
          createdBy: auth.currentUser.uid,
        };
        // console.log(podcastData);
        await addDoc(collection(db, "podcasts"), podcastData);

        // display success toast
        toast.update(toastId, {
          render: "Files Uploaded Successfully!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });

        // clearing Input Fields
        setTitle("");
        setDesc("");
        setBannerImg(null);
        setDisplayImg(null);
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
    <div className="input-wrapper">
      <h1>Create A PodCast</h1>
      <InputComponent
        type={"text"}
        state={title}
        setState={setTitle}
        placeholder={"Title"}
        required={true}
      />
      <InputComponent
        type={"text"}
        state={desc}
        setState={setDesc}
        placeholder={"Description"}
        required={true}
      />
      <FileInput
        type={"file"}
        accept={"image/*"}
        id={"display-img"}
        text={"Display Image"}
        state={displayImg}
        setState={setDisplayImg}
      />
      <FileInput
        type={"file"}
        accept={"image/*"}
        id={"banner-img"}
        text={"Banner Image"}
        state={bannerImg}
        setState={setBannerImg}
      />
      <Button
        text={loading ? "Creating Your Podcast..." : "Create Podcast"}
        disabled={loading}
        onClick={handleCreatePodcast}
      />
    </div>
  );
}

export default CreatePodcastForm;

import React, { useEffect, useState } from "react";
import InputComponent from "../components/Common/Input";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Common/Button";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/Slices/userSlice";
import FileInput from "../components/Common/Input/FileInput";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function EditProfile({ setState }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    // console.log("Hello");
    async function updateUserInfo() {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      let userDocData = (await getDoc(userDocRef)).data();
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        age: userDocData.age ? userDocData.age : "",
        gender: userDocData.gender ? userDocData.gender : "",
        userImage: userDocData.userImage ? userDocData.userImage : "",

        // add key value pairs to get more user details

        // gender: userDocData.gender?userDocData.gender:"",
      });
    }
    updateUserInfo();
  }, [auth.currentUser]);

  const capitalize = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }

    async function getUserDetails() {
      const userDocRef = doc(db, "users", auth.currentUser.uid);

      // Listen to changes to the user document
      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUserDetails(userData);
        } else {
          // Handle if the document doesn't exist
          console.log("User document does not exist");
        }
      });

      // Remember to unsubscribe when the component unmounts
      return unsubscribe;
    }
    getUserDetails();
  }, [auth.currentUser]);

  function updateDetails(key, value) {
    setUserDetails({ ...userDetails, [key]: value });
    // console.log(userDetails);
  }

  // update profile in firebase db

  async function updateProfile() {
    let toastId;
    try {
      setLoading(true);
      // displaying loading toast
      toastId = toast.loading("Updating Your Profile...");

      // uploading banner image

      const userImageRef = ref(
        storage,
        `users/${auth.currentUser.uid}/userImage`
      );
      await uploadBytes(userImageRef, userDetails.userImage);
      const userImageUrl = await getDownloadURL(userImageRef);

      // updating data in firebase db

      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {...userDetails,"userImage":userImageUrl});

      // updating user state in redux

      dispatch(setUser({ ...user, ...userDetails,"userImage":userImageUrl}));
      // display success toast
      toast.update(toastId, {
        render: "Profile Updated Successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      setLoading(false);
      setState(false);
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
  }

  return (
    <div className="input-wrapper">
      <h1>Edit Profile</h1>
      {userDetails && (
        <div>
          <FileInput
            text={"Updated Profile Picture"}
            id={"profile-pic-update"}
            type={"file"}
            accept={"image/*"}
            state={userDetails.userImage}
            objectKey={"userImage"}
            setState={updateDetails}
          />
        </div>
      )}
      {userDetails &&
        Object.entries(userDetails)
          .filter(([key, value]) => {
            return key != "email" && key != "uid" && key != "userImage";
          })
          .map(([key, value], index) => {
            return (
              <div key={index}>
                {/* <h1>{capitalize(key)}</h1> */}
                <InputComponent
                  type={"text"}
                  state={value}
                  objectKey={key}
                  placeholder={capitalize(key)}
                  setState={updateDetails}
                />
              </div>
            );
          })}
      <div className="profile-btn-div">
        {!loading && (
          <Button text={"Cancel Update"} onClick={() => setState(false)} />
        )}
        <Button
          text={loading ? "Updating Profile..." : "Update Profile"}
          onClick={updateProfile}
          disabled={loading}
        />
      </div>
    </div>
  );
}

export default EditProfile;

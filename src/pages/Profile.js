import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Common/Header";
import Button from "../components/Common/Button";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Common/Loader";
import EditProfile from "./EditProfile";

function Profile() {
  const [editProfile, setEditProfile] = useState(false);

  const loaderStyle = {
    display: "flex",
    width: "100vw",
    height: "70vh",
    justifyContent: "center",
    alignItems: "center",
  };

  const userImageStyle = {
    width: "5rem",
    alignSelf: "center",
    marginBottom: "2rem",
    borderRadius: "50%",
  };

  const user = useSelector((state) => state.user.user);
  // console.log(user);
  const navigate = useNavigate();

  //capitaloze function
  const capitalize = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

  function logOutFunc() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        toast.success("Logged Out Successfully!");
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        toast.error(error.message);
        console.log("Error", error);
      });
  }

  return (
    <div className="user-profile-div">
      <Header />
      {!editProfile ? (
        user ? (
          <div className="input-wrapper">
            {user && (
              <img
                src={user.userImage}
                alt="Profile Picture"
                style={userImageStyle}
              />
            )}
            {user &&
              Object.entries(user)
                .filter(([key, value]) => {
                  return key != "uid" && key != "userImage" && value.trim()!="";
                })
                .map(([key, value], index) => {
                  return (
                    <div key={index}>
                      <h1>
                        {capitalize(key)} : {value}
                      </h1>
                    </div>
                  );
                })}
            <div className="profile-btn-div">
              <Button
                text={"Edit Profile"}
                onClick={() => setEditProfile(true)}
              />
              <Button text={"LogOut"} onClick={logOutFunc} />
            </div>
          </div>
        ) : (
          <div style={loaderStyle}>
            <Loader />
          </div>
        )
      ) : (
        <EditProfile setState={setEditProfile} />
      )}
    </div>
  );
}

export default Profile;

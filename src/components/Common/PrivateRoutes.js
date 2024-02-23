import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/Slices/userSlice";

const PrivateRoutes = () => {

  let [updateData,setUpdateData] = useState(true);
  const dispatch = useDispatch();

  
  useEffect(() => {
    if (!updateData || !auth.currentUser) {
      return;
    }
    // console.log("Hello");
    async function updateUserInfo(){
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      let userDocData = (await getDoc(userDocRef)).data();
      dispatch(setUser({...userDocData}));
    }
    updateUserInfo();
    setUpdateData(false);
  }, [auth.currentUser]);

  const loaderStyle = {
    display: "flex",
    width: "100vw",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
  };

  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (error) {
      toast.error("An error occurred while authenticating.");
    } else if (!user && !loading) {
      toast.error("Please Login or SignUp to access your profile.");
    }
  }, [user, loading, error]);

  if (loading) {
    return (
      <div style={loaderStyle}>
        <Loader />
      </div>
    );
  } else if (!user || error) {
    return <Navigate to={"/"} replace />;
  } else {
    return <Outlet />;
  }
};

export default PrivateRoutes;

import React, { useState } from "react";
import InputComponent from "../../Common/Input";
import Button from "../../Common/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/Slices/userSlice";
import { toast } from "react-toastify";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  async function onclickFunc() {
    if (!email.trim() || !password) {
      toast.warn("Please fill all the fields!");
      return;
    }
    try {
      setLoading(true);
      // Login to user account

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;
      // console.log(user);

      // Getting user details from firebase db

      const userDoc = await getDoc(doc(db, "users", user.uid));
      // console.log("UserDoc :",userDoc);
      const userData = userDoc.data();
      // console.log("USerData : ",userData);

      // update data in redux

      dispatch(
        setUser({
          name: userData.name,
          email: user.email,
          uid: user.uid,
        })
      );
      // console.log("User Created");
      setLoading(false);
      toast.success("Login Successfull!");
      navigate("/profile");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      // console.log("Error: ", error.message);
    }
  }

  return (
    <div>
      <InputComponent
        type="email"
        state={email}
        setState={setEmail}
        placeholder="Email"
        required={true}
      />
      <InputComponent
        type="password"
        state={password}
        setState={setPassword}
        placeholder="Password"
        required={true}
      />
      <Button
        text={loading ? "Loading..." : "Login"}
        onClick={onclickFunc}
        disabled={loading}
      />
    </div>
  );
}

export default LoginForm;

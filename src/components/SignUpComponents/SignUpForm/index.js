import React, { useState } from "react";
import InputComponent from "../../Common/Input";
import Button from "../../Common/Button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/Slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  async function onclickFunc() {
    // console.log("Creating User...");
    if(!fullName.trim() || !email.trim() || !password || !confirmPassword){
      toast.warn("Please fill all the fields!");
      return;
    }
    if(!validateEmail(email.trim())){
      toast.warn("Please type valid email!");
      return;
    }
    if (password === confirmPassword && password.length >= 6) {
      setLoading(true);
      try {
        // creating user account

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        const user = userCredential.user;
        // console.log(user);

        // saving user details in firebase db

        await setDoc(doc(db, "users", user.uid), {
          name: fullName.trim(),
          email: user.email,
          uid: user.uid,
        });

        // save data in redux

        dispatch(
          setUser({
            name: fullName.trim(),
            email: user.email,
            uid: user.uid,
          })
        );

        setLoading(false);
        toast.success("Account Created Successfully!");
        // console.log("User Created");
        navigate("/profile");
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
        // console.log("Error: ", error);
      }
    } else {
      if (password !== confirmPassword) {
        toast.warn("Passwords do not Match!");
        // console.log("Passwords do not Match!");
      } else if (password.length < 6) {
        toast.warn("Password should be greater than 5 characters!");
        // console.log("Password too short!");
      }
      return;
    }
  }

  return (
    <div>
      <InputComponent
        type="text"
        state={fullName}
        setState={setFullName}
        placeholder="Full Name"
        required={true}
      />
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
      <InputComponent
        type="password"
        state={confirmPassword}
        setState={setConfirmPassword}
        placeholder="Confirm Password"
        required={true}
      />
      <Button text={loading?"Loading...":"SignUp"} onClick={onclickFunc} disabled={loading}/>
    </div>
  );
}

export default SignUpForm;

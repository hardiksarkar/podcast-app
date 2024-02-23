import React, { useState } from "react";
import Header from "../components/Common/Header";
import SignUpForm from "../components/SignUpComponents/SignUpForm";
import LoginForm from "../components/SignUpComponents/LoginForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function SignUpPage() {
  const [flag, setflag] = useState(false);
  const currentUser = useSelector((state=>state.user.user));
  const navigate = useNavigate();

  if(currentUser){
    navigate("/podcasts");
  }

  const spanStyle = { cursor: "pointer", color: "var(--blue)"};

  return (
    <div>
      <Header />
      <form action="">
        <div className="input-wrapper">
          {flag ? <h1>Login</h1> : <h1>SignUp</h1>}
          {flag ? <LoginForm /> : <SignUpForm />}
          {flag ? (
            <p>
              Don't have an Account?{" "}
              <span style={spanStyle} onClick={() => setflag(!flag)}>Sign-Up</span>
            </p>
          ) : (
            <p>
              Already have an Account? <span style={spanStyle} onClick={() => setflag(!flag)}>Login</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;

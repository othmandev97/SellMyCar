import React, { useState } from "react";
// import googleLogo from "../assets/icons/g.png";
import { Link, useNavigate } from "react-router-dom";
//show password icons
import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
//firebase login
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
//google Oauth
import { AuthGoogle } from "../components/OuthGoogle";
// react-toastify
import { toast } from "react-toastify";

export default function Signin() {
  //create the navigation
  const navigate = useNavigate();
  //password show / hide
  const [pswhidden, setpswhidden] = useState("password");

  function showHidePassword() {
    if (pswhidden === "password") {
      setpswhidden("text");
    } else {
      setpswhidden("password");
    }
  }
  //data from form handler
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  //login with email and password firebase
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.code);
    }
  };

  return (
    <section className="login-wrapper">
      <h1 className="fw-bold">Log in to your account</h1>
      <h2 className="h5 mt-4">Welcome back! Sign in to your account</h2>

      <div className="google-login mt-5 mb-4">
        <p>Continue with:</p>
        <AuthGoogle />
      </div>

      <p className="mt-4 mb-5">or</p>

      <form onSubmit={onSubmit} className="form-group">
        <div className="mb-3">
          <div className="col-sm-12">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Email*"
              value={email}
              id="email"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="mb-3 psw-inpt">
          <div className="col-sm-12">
            <input
              className="form-control form-control-lg"
              type={pswhidden}
              placeholder="Password*"
              value={password}
              id="password"
              onChange={onChange}
            />
            {/* show and hide icon  */}
            <div className="show-hide-password-icon">
              {pswhidden === "password" ? (
                <BsFillEyeFill
                  className="icon-pswd"
                  onClick={showHidePassword}
                />
              ) : (
                <BsFillEyeSlashFill
                  className="icon-pswd"
                  onClick={showHidePassword}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 mb-3 d-flex justify-content-between">
          <Link to="/forgetPassword">Forget Password?</Link>
          <button className="btn btn-primary">Login</button>
        </div>

        <div className="">
          <Link to="/register" className="link-primary">
            Create account
          </Link>
        </div>
      </form>
    </section>
  );
}

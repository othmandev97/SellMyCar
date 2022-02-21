import React, { useState } from "react";
import googleLogo from "../assets/icons/g.png";
import { Link, useNavigate } from "react-router-dom";
//show password icons
import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";

//firebase config
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

//firbase firestore config
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";

//google Oauth
import { AuthGoogle } from "../components/OuthGoogle";

// react-toastify
import { toast } from "react-toastify";

export default function Register() {
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
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const { username, email, phoneNumber, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  //! form submit
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
        phoneNumber
      );
      // Signed in
      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: username,
      });

      const DataCopy = { ...formData };
      delete DataCopy.password;
      DataCopy.timestamp = serverTimestamp();
      // Add a new document in collection "user" in firestore
      await setDoc(doc(db, "users", user.uid), DataCopy);

      //redirect
      navigate("/");
    } catch (error) {
      toast.error(error.code);
    }
  };

  //accept privacy policy
  const [privacyCheck, setprivacyCheck] = useState(true);
  function registerbtnHandler() {
    setprivacyCheck(!privacyCheck);
  }

  return (
    <section className="login-wrapper">
      <h1 className="fw-bold">Register</h1>
      <h2 className="h5 mt-4">Create new account today.</h2>

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
              placeholder="username*"
              id="username"
              value={username}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <div className="col-sm-12">
            <input
              className="form-control form-control-lg"
              type="email"
              placeholder="Email*"
              id="email"
              value={email}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <div className="col-sm-12">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Phone"
              id="phoneNumber"
              value={phoneNumber}
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
              id="password"
              value={password}
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

        <div className="mb-3  form-check">
          <div className="col-sm-12">
            <input
              className="form-check-input"
              type="checkbox"
              id="privacyCheckbox"
              onClick={registerbtnHandler}
            />
            <label className="form-check-label" htmlFor="privacyCheckbox">
              I accept the privacy policy
            </label>
          </div>
        </div>

        <div className="mt-4 mb-3 d-flex justify-content-between">
          <Link to="/forgetPassword">Forget Password?</Link>
          <button className="btn btn-primary" disabled={privacyCheck}>
            Register
          </button>
        </div>

        {/* <div className="">
          <Link to="" className="link-primary">
            Login instead
          </Link>
        </div> */}
      </form>
    </section>
  );
}

import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

//firestore
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
//db
import { db } from "../firebase.config";
import googleLogo from "../assets/icons/g.png";
import { Link, useNavigate } from "react-router-dom";
// react-toastify
import { toast } from "react-toastify";

export const AuthGoogle = () => {
  const navigate = useNavigate();
  const authOnClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info.
      const user = result.user;

      // check the user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      //check the user if not exist, create it
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error(error.code);
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={authOnClick}>
        <img className="h-10" src={googleLogo} alt="google icon" />
        <span>google</span>
      </button>
    </div>
  );
};

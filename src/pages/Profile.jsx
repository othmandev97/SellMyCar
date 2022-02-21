import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
//icons
import { BsPlusLg } from "react-icons/bs";
import { BsPlus } from "react-icons/bs";

//logged user
import { getAuth, signOut, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
// react-toastify
import { toast } from "react-toastify";

//listing item component
import { ListingItem } from "../components/ListingItem";
import { Loading } from "../components/Loading";

export default function Profile() {
  const auth = getAuth();
  //create the navigation
  const navigate = useNavigate();

  const [changeDetails, setChangeDetails] = useState(false);
  const [ListingData, setListingData] = useState(false);
  const [Loader, setLoader] = useState(true);
  //user
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    // phone: auth.currentUser.phone,
  });

  const { username, email } = userData;

  useEffect(() => {
    setUserData({
      username: auth.currentUser.displayName,
      email: auth.currentUser.email,
    });

    const fetshListingData = async () => {
      const listingData = collection(db, "listing");
      const q = query(
        listingData,
        where("userRef", "==", auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);

      let Listing = [];
      querySnapshot.forEach((doc) => {
        return Listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListingData(Listing);
      setLoader(false);
      // console.log(Listing);
    };

    fetshListingData();
  }, []);

  function onlogout() {
    auth.signOut();
    navigate("/");
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== username) {
        // first parametter the current user and
        // the second the data that we want to update
        await updateProfile(auth.currentUser, {
          displayName: username,
        });

        // update in firestore
        // we create a reference and update with doc()
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          username,
          email,
        });

        toast.success("data changed successfully");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const onChange = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (listingId) => {
    if (window.confirm("are you sure want to delte this listing")) {
      await deleteDoc(doc(db, "listing", listingId));
      const modifedListingData = ListingData.filter(
        (list) => list.id !== listingId
      );
      setListingData(modifedListingData);
      toast.success("listing delted succesfully !");
    }
  };

  const onUpdate = (id) => navigate(`/edit-listing/${id}`);

  return (
    <section className="profile-wrapper">
      <div className="profile-header-wrapper">
        <h1 className="fw-bold">Profile</h1>
        {/* show logout button when loggen in */}
        {userData ? (
          <button className="btn btn-primary" onClick={onlogout}>
            logout
          </button>
        ) : (
          ""
        )}
      </div>

      {userData ? (
        <>
          <div className="profile-data-wrapper">
            <form className="form-group">
              <div className="mb-3">
                <input
                  type="email"
                  id="email"
                  placeholder="email"
                  className="form-control"
                  disabled={!changeDetails}
                  value={email}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  id="username"
                  placeholder="username"
                  className="form-control"
                  disabled={!changeDetails}
                  value={username}
                  onChange={onChange}
                />
              </div>

              {/* <div className="mb-3">
              <input
                type="text"
                id="phone"
                placeholder="phone"
                className="form-control"
                disabled={!changeDetails}
                value={phone}
                onChange={onChange}
              />
            </div> */}
            </form>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? "done" : "change"}
            </button>
          </div>

          <div className="addListing__wrapper">
            <Link to="/addListing" className="btn btn-outline-primary">
              <BsPlus /> add listing
            </Link>
          </div>

          <div className="mylisting-wrapper">
            <h3>my listing</h3>

            {!Loader ? (
              <>
                {ListingData.map((list) => (
                  <>
                    <ListingItem
                      key={list.id}
                      list={list}
                      id={list.id}
                      onDelete={() => onDelete(list.id)}
                      onUpdate={() => onUpdate(list.id)}
                    />
                  </>
                ))}
              </>
            ) : (
              <Loading />
            )}
          </div>
        </>
      ) : (
        <div
          className="alert alert-primary d-flex align-items-center"
          role="alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
            viewBox="0 0 16 16"
            role="img"
            aria-label="Warning:"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <div>
            You don't have access you need to <Link to="/signin">Login</Link> or
            <Link to="/register"> Register</Link> first
          </div>
        </div>
      )}
    </section>
  );
}

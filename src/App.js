import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Offers from "./pages/Offers";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import ForgetPassword from "./pages/ForgetPassword";
import Listing from "./pages/Listing";
import EditListing from "./pages/EditListing";

import { PrivateRoute } from "./components/PrivateRoute";
// import react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import { AddListing } from "./pages/AddListing";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />}></Route>
        </Route>
        <Route path="/offers" element={<Offers />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/forgetPassword" element={<ForgetPassword />}></Route>
        <Route path="/addListing" element={<AddListing />}></Route>
        <Route path="/Listing/:itemid" element={<Listing />}></Route>
        <Route path="/edit-listing/:itemid" element={<EditListing />}></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Routes>
      <Navbar />
      <ToastContainer />
    </>
  );
}

export default App;

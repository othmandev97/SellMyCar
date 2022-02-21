import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/car2.png";
export default function Navbar() {
  return (
    <header className="header-wrapper">
      <div>
        <h1>Find Your Dream Car</h1>
        <img src={heroImage} alt="" />
      </div>
    </header>
  );
}

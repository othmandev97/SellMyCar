import React from "react";
import { Link, useLocation } from "react-router-dom";
//icons
import { VscTag } from "react-icons/vsc";
import { BsHouse } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import { BsTag } from "react-icons/bs";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <footer className="footer-navbar">
      <ul className="nav ">
        <li className="nav-item">
          <Link className={`nav-link ${path === "/" ? "active" : ""}`} to="/">
            <BsHouse />
            Home
          </Link>
          {/* <a className="nav-link" href=""></a> */}
        </li>
        <li className="nav-item">
          {/* <a className="nav-link" href=""> */}
          <Link
            className={`nav-link ${path === "/offers" ? "active" : ""}`}
            to="/offers"
          >
            <BsTag />
            Offers
          </Link>
          {/* </a> */}
        </li>
        <li className="nav-item">
          {/* <a className="nav-link" href=""> */}
          <Link
            className={`nav-link ${path === "/profile" ? "active" : ""}`}
            to="/profile"
          >
            <BsPerson />
            Account
          </Link>
          {/* </a> */}
        </li>
      </ul>
    </footer>
  );
}

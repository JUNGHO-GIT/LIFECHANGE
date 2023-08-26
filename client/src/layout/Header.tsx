// Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../assets/css/Custom.css";

// ------------------------------------------------------------------------------------------------>
const Header = () => {
  const user_id = sessionStorage.getItem("user_id");

  // ---------------------------------------------------------------------------------------------->
  const navList = () => {
    return (
      <ul className="nav">
        <li>
          <Link to="/" className="nav-link text-hover ms-2 text-white">
            Home
          </Link>
        </li>
        <li>
          <Link to="/userDetail" className="nav-link text-hover ms-2 text-white">
            User
          </Link>
        </li>
        <li>
          <Link to="/boardList" className="nav-link text-hover ms-2 text-white">
            Board
          </Link>
        </li>
        <li>
          <Link to="/calendarList" className="nav-link text-hover ms-2 text-white">
            Calendar
          </Link>
        </li>
        <li>
          <Link to="/foodList" className="nav-link text-hover ms-2 text-white">
            Food
          </Link>
        </li>
      </ul>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const formList = () => {
    return (
      <form className="form-group custom-flex-center">
        {user_id !== "false" ? (
          <button
            type="button"
            className="btn btn-outline-light ms-2"
            onClick={() => {
              sessionStorage.setItem("user_id", "false");
              window.location.reload();
            }}>
            Logout
          </button>
        ) : (
          <>
            <button type="button" className="btn btn-outline-light ms-2" onClick={() => (window.location.href = "/userLogin")}>
              Login
            </button>
            <button type="button" className="btn btn-outline-light ms-2" onClick={() => (window.location.href = "/userInsert")}>
              Signup
            </button>
          </>
        )}
      </form>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container-fluid bg-dark">
      <div className="row custom-flex-center">
        <div className="col-8">
          {navList()}
        </div>
        <div className="col-4">
          {formList()}
        </div>
      </div>
    </div>
  );
};

export default Header;
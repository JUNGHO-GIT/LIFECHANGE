// Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import "../assets/Custom.css";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  const user_id = window.sessionStorage.getItem("user_id");

  // ---------------------------------------------------------------------------------------------->
  const NavList = () => {
    return (
      <ul className="nav">
        <li>
          <Link to="/" className="nav-link fs-14 tc-w ms-2">Home</Link>
        </li>
        <li>
          <Link to="/userDetail" className="nav-link fs-14 tc-w ms-2">User</Link>
        </li>
        <li>
          <Link to="/boardList" className="nav-link fs-14 tc-w ms-2">Board</Link>
        </li>
        <li>
          <Link to="/calendarList" className="nav-link fs-14 tc-w ms-2">Calendar</Link>
        </li>
        <li>
          <Link to="/foodSearch" className="nav-link fs-14 tc-w ms-2">Food</Link>
        </li>
        <li>
          <Link to="/workoutList" className="nav-link fs-14 tc-w ms-2">Workout</Link>
        </li>
        <li>
          <Link to="/sleepList" className="nav-link fs-14 tc-w ms-2">Sleep</Link>
        </li>
      </ul>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const FormList = () => {

    // 로그인 x
    const loginFalse = () => {
      const buttonLogin = () => {
        return (
          <Link to="/userLogin">
            <button type="button" className="btn btn-outline-light ms-2">Login</button>
          </Link>
        );
      };
      const buttonSignup = () => {
        return (
          <Link to="/userInsert">
            <button type="button" className="btn btn-outline-light ms-2">Signup</button>
          </Link>
        );
      };

      if (!user_id || user_id === "false") {
        return (
          <form className="form-group d-center">
            {buttonLogin()}
            {buttonSignup()}
          </form>
        );
      }
    };

    // 로그인 o
    const loginTrue = () => {
      if (user_id && user_id !== "false") {
        return (
          <form className="form-group d-center">
            <button type="button" className="btn btn-outline-light ms-2"
              onClick={() => {
                sessionStorage.setItem("user_id", "false");
                window.location.reload();
              }}>
              Logout
            </button>
          </form>
        );
      }
    };

    return (
      <div className="d-center">
        {loginFalse()}
        {loginTrue()}
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <header className="container-fluid bg-dark">
      <div className="row d-center pt-3 pb-3">
        <div className="col-9">{NavList()}</div>
        <div className="col-3">{FormList()}</div>
      </div>
    </header>
  );
};
import React from "react";
import {Link} from "react-router-dom";
import "../assets/Custom.css";

export const Header = () => {
  const user_id = window.sessionStorage.getItem("user_id");

  // ---------------------------------------------------------------------------------------------->
  const NavList = () => {

    // -------------------------------------------------------------------------------------------->
    return (
      <ul className="nav">
        {/* main */}
        <li>
          <div className="dropdown ms-2">
            <a className="text-decoration-none text-light dropdown-toggle" href="#" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Main
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li className="py-1">
                <Link to="/" className="dropdown-item">
                  Home
                </Link>
              </li>
              <li className="py-1">
                <Link to="/test" className="dropdown-item">
                  Test
                </Link>
              </li>
            </ul>
          </div>
        </li>
        {/* user */}
        <li>
          <div className="dropdown ms-2">
            <a className="text-decoration-none text-light dropdown-toggle" href="#" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              User
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li className="py-1">
                <Link to="/userList" className="dropdown-item">
                  UserList
                </Link>
              </li>
              <li className="py-1">
                <Link to="/userLogin" className="dropdown-item">
                  Login
                </Link>
              </li>
              <li className="py-1">
                <Link to="/userInsert" className="dropdown-item">
                  Signup
                </Link>
              </li>
            </ul>
          </div>
        </li>
        {/* board */}
        <li>
          <div className="dropdown ms-2">
            <a className="text-decoration-none text-light dropdown-toggle" href="#" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Board
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li className="py-1">
                <Link to="/boardList" className="dropdown-item">
                  BoardList
                </Link>
              </li>
              <li className="py-1">
                <Link to="/boardInsert" className="dropdown-item">
                  BoardInsert
                </Link>
              </li>
            </ul>
          </div>
        </li>
        {/* calendar */}
        <li>
          <div className="dropdown ms-2">
            <a className="text-decoration-none text-light dropdown-toggle" href="#" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Calendar
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li className="py-1">
                <Link to="/calendarList" className="dropdown-item">
                  CalendarList
                </Link>
              </li>
            </ul>
          </div>
        </li>
        {/* food */}
        <li>
          <div className="dropdown ms-2">
            <a className="text-decoration-none text-light dropdown-toggle" href="#" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Food
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li className="py-1">
                <Link to="/foodSearch" className="dropdown-item">
                  FoodSearch
                </Link>
              </li>
              <li className="py-1">
                <Link to="/foodList" className="dropdown-item">
                  FoodList
                </Link>
              </li>
            </ul>
          </div>
        </li>
        {/* workout */}
        <li>
          <div className="dropdown ms-2">
              <a className="text-decoration-none text-light dropdown-toggle" href="#" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Workout
              </a>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li className="py-1">
                  <Link to="/workoutList" className="nav-link fs-14 tc-w ms-2">
                    WorkoutList
                  </Link>
                </li>
                <li className="py-1">
                  <Link to="/workoutInsert" className="nav-link fs-14 tc-w ms-2">
                    WorkoutInsert
                  </Link>
                </li>
              </ul>
          </div>
        </li>
        {/* sleep */}
        <li>
          <div className="dropdown ms-2">
            <a className="text-decoration-none text-light dropdown-toggle" href="#" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Sleep
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li className="py-1">
                <Link to="/sleepListDay" className="dropdown-item">
                  SleepDay
                </Link>
              </li>
              <li className="py-1">
                <Link to="/sleepListWeek" className="dropdown-item">
                  SleepWeek
                </Link>
              </li>
              <li className="py-1">
                <Link to="/sleepListMonth" className="dropdown-item">
                  SleepMonth
                </Link>
              </li>
              <li className="py-1">
                <Link to="/sleepListYear" className="dropdown-item">
                  SleepYear
                </Link>
              </li>
              <li className="py-1">
                <Link to="/sleepListSelect" className="dropdown-item">
                  SleepSelect
                </Link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const loginFalse = () => {

    const buttonLogin = () => {
      return (
        <Link to="/userLogin">
          <button type="button" className="btn btn-outline-light ms-2">
            Login
          </button>
        </Link>
      );
    };

    const buttonSignup = () => {
      return (
        <Link to="/userInsert">
          <button type="button" className="btn btn-outline-light ms-2">
            Signup
          </button>
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

  // -------------------------------------------------------------------------------------------->
  const loginTrue = () => {
    if (user_id && user_id !== "false") {
      return (
        <form className="form-group d-center">
          <button
            type="button"
            className="btn btn-outline-light ms-2"
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

  // ---------------------------------------------------------------------------------------------->
  return (
    <header className="container-fluid bg-dark">
      <div className="row d-center pt-3 pb-3">
        <div className="col-9">{NavList()}</div>
        <div className="col-3">{loginFalse()}{loginTrue()}</div>
      </div>
    </header>
  );
};
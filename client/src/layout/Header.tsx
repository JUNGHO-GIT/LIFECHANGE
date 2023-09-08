import React from "react";
import {Link} from "react-router-dom";
import "../assets/Custom.css";

// -------------------------------------------------------------------------------------------->
export const Header = () => {

  const user_id = window.sessionStorage.getItem("user_id");

  // -------------------------------------------------------------------------------------------->
  const DropdownItem:React.FC<{to: string, label: string }> = ({ to, label }) => (
    <li className="py-1">
      <Link to={to} className="dropdown-item">
        {label}
      </Link>
    </li>
  );

  // -------------------------------------------------------------------------------------------->
  const DropdownMenu:React.FC<{ label: string, items: {to: string, label: string }[] }> = ({ label, items }) => (
    <li className="me-5">
      <div className="dropdown ms-2">
        <a className="text-decoration-none text-light dropdown-toggle" href="#" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          {label}
        </a>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
          {items.map(item => (
            <DropdownItem key={item.to} {...item} />
          ))}
        </ul>
      </div>
    </li>
  );

  // -------------------------------------------------------------------------------------------->
  const NavList = () => {
    const menus = [
      {
        label: "Main",
        items: [
          {to: "/", label: "Home"},
          {to: "/test", label: "Test"}
        ]
      },
      {
        label: "User",
        items: [
          {to: "/userList", label: "UserList"},
          {to: "/userLogin", label: "Login"},
          {to: "/userInsert", label: "Signup"}
        ]
      },
      {
        label: "Board",
        items: [
          {to: "/boardList", label: "BoardList"},
          {to: "/boardInsert", label: "BoardInsert"}
        ]
      },
      {
        label: "Calendar",
        items: [
          {to: "/calendarList", label: "CalendarList"}
        ]
      },
      {
        label: "Food",
        items: [
          {to: "/foodSearch", label: "FoodSearch"},
          {to: "/foodList", label: "FoodList"}
        ]
      },
      {
        label: "Workout",
        items: [
          {to: "/workoutList", label: "WorkoutList"},
          {to: "/workoutInsert", label: "WorkoutInsert"}
        ]
      },
      {
        label: "Sleep",
        items: [
          {to: "/sleepListDay", label: "SleepDay"},
          {to: "/sleepListWeek", label: "SleepWeek"},
          {to: "/sleepListMonth", label: "SleepMonth"},
          {to: "/sleepListYear", label: "SleepYear"},
          {to: "/sleepListSelect", label: "SleepSelect"}
        ]
      }
    ];
    return (
      <ul className="nav bg-dark rounded">
        {menus.map(menu => <DropdownMenu key={menu.label} {...menu} />)}
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
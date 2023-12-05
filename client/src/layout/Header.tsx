import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import moment from "moment-timezone";
import axios from "axios";
import {useDeveloperMode} from "../assets/ts/useDeveloperMode";

// 1. main ---------------------------------------------------------------------------------------->
export const Header = () => {
  // title
  const TITLE = "Header";
  // url
  const URL_HEADER = process.env.REACT_APP_URL_HEADER;
  // date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-1. useState -------------------------------------------------------------------------------->
  const {isDeveloperMode, toggleDeveloperMode} = useDeveloperMode();

  // 4-1. logic ----------------------------------------------------------------------------------->
  const DropdownItem: React.FC<{to: string, label: string}> = ({to, label}) => (
    <li className="pt-1 pb-1">
      <div className="dropdown-item pointer" onClick={(e) => {
        e.preventDefault();
        navParam(to);
      }}>
        {label}
      </div>
    </li>
  );

  // 4-2. logic ----------------------------------------------------------------------------------->
  const DropdownMenu: React.FC<{ label: string, items: {to: string, label: string}[] }> = ({
    label, items
  }) => (
    <li className="me-30">
      <div className="dropdown ms-5">
        <div className="text-decoration-none text-light dropdown-toggle pointer" data-bs-toggle="dropdown" aria-expanded="false">
          {label}
        </div>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
          {items.map(item => (
            <DropdownItem key={item.to} {...item} />
          ))}
        </ul>
      </div>
    </li>
  );

  // 5. table ------------------------------------------------------------------------------------->
  const tableNaveList = () => {
    const menus = [
      {
        label: "Main",
        items: [
          {to: "/", label: "Home"},
        ]
      },
      {
        label: "User",
        items: [
          {to: "/userList", label: "UserList"},
        ]
      },
      {
        label: "Board",
        items: [
          {to: "/boardInsert", label: "BoardInsert"},
          {to: "/boardList", label: "BoardList"},
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
          {to: "/foodSearchList", label: "FoodSearchList"},
          {to: "/foodListDay", label: "FoodList"}
        ]
      },
      {
        label: "Work",
        items: [
          {to: "/workInsert", label: "WorkInsert"},
          {to: "/workListDay", label: "WorkList"},
        ]
      },
      {
        label: "Sleep",
        items: [
          {to: "/sleepInsert", label: "SleepInsert"},
          {to: "/sleepListDay", label: "SleepList"}
        ]
      },
      {
        label: "Money",
        items: [
          {to: "/moneyInsert", label: "MoneyInsert"},
          {to: "/moneyListDay", label: "MoneyList"}
        ]
      },
    ];
    return (
      <ul className="nav bg-dark rounded">
        {menus.map(menu => <DropdownMenu key={menu.label} {...menu} />)}
      </ul>
    );
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const loginFalse = () => {
    const buttonLogin = () => {
      return (
        <button type="button" className="btn btn-sm btn-outline-light ms-2" onClick={() => {
          navParam("/userLogin");
        }}>
          Login
        </button>
      );
    };
    const buttonSignup = () => {
      return (
        <button type="button" className="btn btn-sm btn-outline-light ms-2" onClick={() => {
          navParam("/userInsert");
        }}>
          Signup
        </button>
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

  // 6-2. button ---------------------------------------------------------------------------------->
  const loginTrue = () => {
    if (user_id && user_id !== "false") {
      return (
        <form className="form-group d-center">
          <button type="button" className="btn btn-sm btn-outline-light ms-2" onClick={() => {
            sessionStorage.setItem("user_id", "false");
            window.location.reload();
          }}>
            Logout
          </button>
        </form>
      );
    }
  };

  // 6-3. button ---------------------------------------------------------------------------------->
  const buttonDeveloperMode = () => {
    const buttonClass
    = isDeveloperMode ? "btn btn-sm btn-light ms-2" : "btn btn-sm btn-outline-light ms-2";
    return (
      <button type="button" className={buttonClass} onClick={() => {
        toggleDeveloperMode();
      }}>
        Dev
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <header className="container-fluid bg-dark">
      <div className="row d-center pt-15 pb-15">
        <div className="col-9">
          {tableNaveList()}
        </div>
        <div className="col-1">
          {buttonDeveloperMode()}
        </div>
        <div className="col-2">
          {loginFalse()}
          {loginTrue()}
        </div>
      </div>
    </header>
  );
};
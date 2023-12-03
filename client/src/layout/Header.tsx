import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { DayClickEventHandler, DayPicker } from "react-day-picker";
import moment from "moment-timezone";
import axios from "axios";

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

  // 4-1. logic ----------------------------------------------------------------------------------->
  const DropdownItem: React.FC<{ to: string, label: string }> = ({ to, label }) => (
    <li className="py-1">
      <a href="#" className="dropdown-item" onClick={(e) => {
        e.preventDefault();
        navParam(to);
      }}>
        {label}
      </a>
    </li>
  );

  // 4-2. logic ----------------------------------------------------------------------------------->
  const DropdownMenu: React.FC<{ label: string, items: { to: string, label: string }[] }> = ({ label, items }) => (
    <li className="me-30">
      <div className="dropdown ms-5">
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
          {to: "/foodSearch", label: "FoodSearch"},
          {to: "/foodList", label: "FoodList"}
        ]
      },
      {
        label: "Work",
        items: [
          {to: "/workInsert", label: "WorkInsert"},
          {to: "/workList", label: "WorkList"},
        ]
      },
      {
        label: "Sleep",
        items: [
          {to: "/sleepInsert", label: "SleepInsert"},
          {to: "/sleepList", label: "SleepList"}
        ]
      }
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

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <header className="container-fluid bg-dark">
      <div className="row d-center pt-15 pb-15">
        <div className="col-9">{tableNaveList()}</div>
        <div className="col-3">{loginFalse()}{loginTrue()}</div>
      </div>
    </header>
  );
};
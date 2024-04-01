// Header.jsx

import React from "react";
import {useState, useEffect} from "react";
import {Collapse} from "react-bootstrap";
import {useNavigate, useLocation} from "react-router-dom";
import {useDeveloperMode} from "../assets/js/useDeveloperMode";
import {listArray} from "./ListArray";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {isDeveloperMode, toggleDeveloperMode} = useDeveloperMode();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isSidebar, setIsSidebar] = useState(true);
  const [isActive, setIsActive] = useState(location.pathname);
  const [isExpended, setIsExpended] = useState({});

  // 3-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setIsActive(location.pathname);
  }, [location]);

  const toggleExpand = (menuLabel) => {
    setIsExpended(isExpended === menuLabel ? null : menuLabel);
  };

  // 4-1. view ------------------------------------------------------------------------------------>
  const SidebarItem = ({label, items}) => (
    <li className="text-start pointer mt-30 ps-20">
      <div className={`${isActive === label ? "highlight" : ""}`} onClick={() => toggleExpand(label)}>
        {label}
      </div>
      <Collapse in={isExpended === label}>
        <ul>
          {items.map(({ to, label }) => (
            <li key={to} className={`fs-14 fw-400 ${isActive === to ? "highlight" : ""}`}>
              <div className="pointer" onClick={() => {navParam(to); setIsActive(to);}}>
                {label}
              </div>
            </li>
          ))}
        </ul>
      </Collapse>
    </li>
  );

  // 4-2. view ------------------------------------------------------------------------------------>
  const Sidebar = () => {
    return (
      <div className={`sidebar ${isSidebar ? "sidebar-open" : "sidebar-closed"} bg-white rounded box-right`}>
        <div className="d-flex justify-content-between align-items-center text-dark pointer p-10">
          <h3 className="ps-20">Changer</h3>
          <p className="pt-10 pe-10" onClick={() => setIsSidebar(!isSidebar)}>X</p>
        </div>
        <div className="d-flex flex-column p-3">
          <ul className="nav nav-pills flex-column mb-auto fs-20 fw-500 text-dark">
            {listArray.map(menu => <SidebarItem key={menu.label} {...menu} />)}
          </ul>
        </div>
      </div>
    );
  };

  // 4-3. view ------------------------------------------------------------------------------------>
  const Navbar = () => {
    let preFix;
    let subFix = isActive.split("/")[1];
    let lowFix;

    listArray.forEach((menu) => {
      if (isActive.includes(menu.label.toLowerCase())) {
        preFix = menu.label;
        lowFix = preFix.toLowerCase()
      }
    });

    return (
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-start">
          <h1 className="fs-30 fw-500 ps-30">{preFix} / {subFix}</h1>
        </div>
        <div className="text-end">
          <button type="button" className="btn btn-primary btn-sm me-5" onClick={() => {
            navParam(`/${lowFix}/dash`);
          }}>
            Dash
          </button>
          <button type="button" className="btn btn-primary btn-sm me-5" onClick={() => {
            navParam(`/${lowFix}/save`);
          }}>
            Save
          </button>
          <button type="button" className="btn btn-primary btn-sm me-5" onClick={() => {
            navParam(`/${lowFix}/list`);
          }}>
            List
          </button>
        </div>
      </div>
    );
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const loginFalse = () => {
    const buttonLogin = () => {
      return (
        <button type="button" className="btn btn-sm ms-2" onClick={() => {
          navParam("/user/login");
        }}>
          Login
        </button>
      );
    };
    const buttonSignup = () => {
      return (
        <button type="button" className="btn btn-sm ms-2" onClick={() => {
          navParam("/user/save");
        }}>
          Signup
        </button>
      );
    };
    if (!user_id || user_id === "false") {
      return (
        <form className="form-group d-right">
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
        <form className="form-group d-right">
          <button type="button" className="btn btn-sm ms-2" onClick={() => {
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
    = isDeveloperMode ? "btn btn-sm btn-secondary ms-2" : "btn btn-sm ms-2";
    return (
      <button type="button" className={buttonClass} onClick={() => {
        toggleDeveloperMode();
      }}>
        Dev
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div>
      <div className="container-fluid bg-white box-bottom">
        <div className="row d-center pt-15 pb-15">
          <div className="col-1">
            {Sidebar()}
            <button type="button" className="btn btn-sm ms-2" onClick={() => {
              setIsSidebar(!isSidebar);
            }}>
              Sidebar
            </button>
          </div>
          <div className="col-7">
            &nbsp;
          </div>
          <div className="col-1">
            {buttonDeveloperMode()}
          </div>
          <div className="col-2">
            {loginFalse()}
            {loginTrue()}
          </div>
        </div>
      </div>
      <div className="root-wrapper">
        <div className="container-fluid">
          <div className="row d-center pt-15 pb-15">
            <div className="col-12">
              {Navbar()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Header.tsx

import React, {useState} from "react";
import {useEffect} from "react";
import {Collapse} from "react-bootstrap";
import {useNavigate, useLocation} from "react-router-dom";
import moment from "moment-timezone";
import {useDeveloperMode} from "../assets/ts/useDeveloperMode";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const SidebarStyle = createGlobalStyle`
  .sidebar {
    position: fixed;
    text-align: center;
    left: 0;
    top: 0;
    width: 250px;
    height: 100%;
    background-color: #343a40;
    transition: transform 0.3s ease;
    transform: translateX(-100%);
    z-index: 5;
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .sidebar-closed {
    transform: translateX(-100%);
  }

  .highlight {
    transition: background-color 0.5s ease;
    background-color: #f0f0f0;
  }

  .sidebar ul {
    padding: 5px 0px 0px 10px;
    list-style: none;
  }

  .sidebar-item {
    transition: background-color 0.3s ease;
  }

  .sidebar-item:hover {
    background-color: #495057;
  }

  .collapse-enter-active, .collapse-exit-active {
    transition: height 0.5s ease;
  }

  .collapse-enter, .collapse-exit-active {
    height: 0;
  }

  .collapse-enter-active, .collapse-exit {
    height: auto;
  }
`;

// ------------------------------------------------------------------------------------------------>
export const Header = () => {
  const TITLE = "Header";
  const URL_HEADER = process.env.REACT_APP_URL_HEADER;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {isDeveloperMode, toggleDeveloperMode} = useDeveloperMode();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isSidebar, setIsSidebar] = useState(false);
  const [isActive, setIsActive] = useState(location.pathname);
  const [isExpended, setIsExpended] = useState({});

  // 3-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setIsActive(location.pathname);
  }, [location]);

  // Toggle menu expansion
  const toggleExpand = (menuLabel:any) => {
    setIsExpended(isExpended === menuLabel ? null : menuLabel);
  };

  // 4-1. view ------------------------------------------------------------------------------------>
  const SidebarArray = [
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
    {
      label: "Plan",
      items: [
        {to: "/planInsert", label: "PlanInsert"},
        {to: "/planListDay", label: "PlanList"}
      ]
    }
  ];

  // 4-2. view ------------------------------------------------------------------------------------>
  const SidebarItem: React.FC<{ label: string, items: { to: string, label: string }[] }> = ({
    label, items
  }) => (
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

  // 4-3. view ------------------------------------------------------------------------------------>
  const Sidebar = () => {
    return (
      <div className={`sidebar ${isSidebar ? "sidebar-open" : "sidebar-closed"} bg-white rounded`}>
        <p className="text-end pointer text-dark p-10" onClick={() => {
          setIsSidebar(!isSidebar);
        }}>
          X
        </p>
        <div className="d-flex flex-column flex-shrink-0 p-3">
          <ul className="nav nav-pills flex-column mb-auto fs-20 fw-500 text-dark">
            {SidebarArray.map(menu => <SidebarItem key={menu.label} {...menu} />)}
          </ul>
        </div>
      </div>
    );
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const loginFalse = () => {
    const buttonLogin = () => {
      return (
        <button type="button" className="btn btn-sm ms-2" onClick={() => {
          navParam("/userLogin");
        }}>
          Login
        </button>
      );
    };
    const buttonSignup = () => {
      return (
        <button type="button" className="btn btn-sm ms-2" onClick={() => {
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
    = isDeveloperMode ? "btn btn-sm btn-light ms-2" : "btn btn-sm ms-2";
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
    <header className="container-fluid bg-white mb-30">
      <SidebarStyle />
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
    </header>
  );
};
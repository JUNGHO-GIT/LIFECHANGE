// Header.tsx

import React, {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import moment from "moment-timezone";
import {useDeveloperMode} from "../assets/ts/useDeveloperMode";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const SidebarStyle = createGlobalStyle`
  .bd-placeholder-img {
    font-size: 1.125rem;
    text-anchor: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  @media (min-width: 768px) {
    .bd-placeholder-img-lg {
      font-size: 3.5rem;
    }
  }

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
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .sidebar-closed {
    transform: translateX(-100%);
  }

  .sidebar p {
    color: white;
    padding: 20px;
  }

`;

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1-1. title
  const TITLE = "Header";
  // 1-2. url
  const URL_HEADER = process.env.REACT_APP_URL_HEADER;
  // 1-3. date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // 1-4. hook
  const navParam = useNavigate();
  const location = useLocation();
  // 1-5. val
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {isDeveloperMode, toggleDeveloperMode} = useDeveloperMode();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isSidebar, setIsSidebar] = useState(false);

  // 2-3. useEffect ------------------------------------------------------------------------------->

  // 3. sidebar ----------------------------------------------------------------------------------->
  const sidebar = () => {
    return (
      <div className={`sidebar ${isSidebar ? "sidebar-open" : "sidebar-closed"} bg-dark rounded`}>
        <p className="text-center pointer" onClick={() => {
          setIsSidebar(!isSidebar);
        }}>
          X
        </p>
        <div className="d-flex flex-column flex-shrink-0 p-3">
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <a href="#" className="nav-link active">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-light">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-light">
                Orders
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-light">
                Products
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-light">
                Customers
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  // 4-1. view ------------------------------------------------------------------------------------>
  const DropdownItem: React.FC<{to: string, label: string}> = ({
    to, label
  }) => (
    <li className="pt-1 pb-1">
      <div className="dropdown-item pointer" onClick={(e) => {
        e.preventDefault();
        navParam(to);
      }}>
        {label}
      </div>
    </li>
  );

  // 4-2. view ------------------------------------------------------------------------------------>
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

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableNavList = () => {
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
      },
      {
        label: "Test",
        items: [
          {to: "/test", label: "Test"}
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
      <SidebarStyle />
      <div className="row d-center pt-15 pb-15">
        <div className="col-1">
          {sidebar()}
          <button type="button" className="btn btn-sm btn-outline-light ms-2" onClick={() => {
            setIsSidebar(!isSidebar);
          }}>
            Sidebar
          </button>
        </div>
        <div className="col-7">
          {tableNavList()}
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
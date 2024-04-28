// SideBar.jsx

import React, {useState, useEffect} from "react";
import moment from "moment-timezone";
import {useNavigate, useLocation} from "react-router-dom";
import {dataArray} from "../assets/data/DataArray.jsx";
import {useStorage} from "../assets/hooks/useStorage.jsx";
import {Collapse} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const SideBar = ({ sidebar, onClose }) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:SEND, set:setSEND} = useStorage (
    `SEND(${PATH})`, {
      id: "",
      date: koreanDate,
      refresh: 0,
      toLogin: "/customer/login",
      toSignup: "/customer/signup",
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isSidebar, setIsSidebar] = useState(sidebar);
  const [isActive, setIsActive] = useState(PATH);
  const [isExpended, setIsExpended] = useState({});

  // 3-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setIsSidebar(sidebar);
  }, [sidebar]);

  // 3-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setIsActive(location.pathname);
  }, [location.pathname]);

  // 4. toggle ------------------------------------------------------------------------------------>
  const toggleExpand = (menuLabel) => {
    setIsExpended(isExpended === menuLabel ? null : menuLabel);
  };

  let preFix;
  let lowFix;

  dataArray.forEach((menu) => {
    if (isActive.includes(menu.title.toLowerCase())) {
      preFix = menu.title;
      lowFix = preFix.toLowerCase()
    }
  });

  // 5. node -------------------------------------------------------------------------------------->
  const sidBarItem = (icon, title, items) => {
    return (
      <React.Fragment>
        <ul className={"sidebar-ul-text"}>
          <li className={"sidebar-li-text"}>
            <div className={`${isActive === title ? "highlight" : ""}`} onClick={() => (
              toggleExpand(title)
            )}>
              <i className={`${icon} me-5`}/>
              <span>{title}</span>
            </div>
            <Collapse in={isExpended === title}>
              <ul>
                {items?.map(({ to, label }) => (
                  <li key={to} className={`sidebar-li-ul-text ${isActive === to ? "highlight" : ""}`}>
                    <div onClick={() => {
                      SEND.startDt = koreanDate;
                      SEND.endDt = koreanDate;
                      navParam(to, {
                        state: SEND
                      });
                      setIsActive(to);
                      onClose();
                    }}>
                      {label}
                    </div>
                  </li>
                ))}
              </ul>
            </Collapse>
          </li>
        </ul>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={`sidebar ${isSidebar ? "sidebar-open" : "sidebar-closed"} bg-white rounded box-right`}>
        <div className={"sidebar-head-group"}>
          <span className={"sidebar-head-title"}>Changer</span>
          <span className={"sidebar-head-close"} onClick={onClose}>X</span>
        </div>
        <div>
          {dataArray?.map((menu) => (
            sidBarItem(menu.icon, menu.title, menu.items)
          ))}
        </div>
        <div className={"btn btn-sm btn-danger pointer"} onClick={() => (
          localStorage.clear()
        )}>
          Clear
        </div>
      </div>
    </React.Fragment>
  );
};
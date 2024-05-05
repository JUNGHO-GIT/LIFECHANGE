// SideBar.jsx

import React, {useState, useEffect} from "react";
import moment from "moment-timezone";
import "moment/locale/ko";
import {useNavigate, useLocation} from "react-router-dom";
import {dataArray} from "../assets/array/dataArray.js";
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import {Collapse} from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
// @ts-ignore
import logo3 from "../assets/images/logo3.png";

// ------------------------------------------------------------------------------------------------>
export const SideBar = ({isSidebarOpen, setIsSidebarOpen}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    refresh: 0,
    toLogin: "/user/login",
    toSignup: "/user/signup",
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isFirstOpen, setIsFirstOpen] = useState("");
  const [isSecondOpen, setIsSecondOpen] = useState("");

  // 3-1. isFirstOpen ----------------------------------------------------------------------------->
  const toggleFirstOpen = (menuLabel) => {
    if (menuLabel) {
      setIsFirstOpen(isFirstOpen === menuLabel ? null : menuLabel);
    }
  };

  // 3-2. isSecondOpen ---------------------------------------------------------------------------->
  useEffect(() => {
    if (location.pathname) {
      setIsSecondOpen(location.pathname);
    }
  }, [location.pathname]);

  // 4. sidebarNode ------------------------------------------------------------------------------->
  const sidBarNode = () => (
    <SwipeableDrawer open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onOpen={() => setIsSidebarOpen(true)} className={"sidebar"}>
      <List sx={{width:200}} role={"presentation"} component={"nav"} className={"sidebar-ul-text"}>
        {dataArray.map((item, index) => (
          <Box key={index} sx={{width:200}}>
            <ListItemButton key={index} className={`sidebar-li-text ${isFirstOpen === item.title?"highlight":""}`} onClick={() => (
              toggleFirstOpen(item.title)
            )}>
              <ListItemIcon><i className={`${item.icon}`}></i></ListItemIcon>
              <ListItemText>{item.title}</ListItemText>
            </ListItemButton>
            <Collapse in={isFirstOpen === item.title} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item?.items?.map(({ to, label }) => (
                  <ListItemButton key={to} className={`sidebar-li2-text ${isSecondOpen === to?"highlight":""}`}
                  onClick={() => {
                    SEND.startDt = koreanDate;
                    SEND.endDt = koreanDate;
                    navParam(to, {
                      state: SEND
                    });
                    setIsSidebarOpen(false);
                    setIsSecondOpen(to);
                  }}>
                    <ListItemText>{label}</ListItemText>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </SwipeableDrawer>
  );

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {sidBarNode()}
    </React.Fragment>
  );
};
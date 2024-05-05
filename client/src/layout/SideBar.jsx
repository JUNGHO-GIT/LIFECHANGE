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
export const SideBar = ({ sidebar, onClose }) => {

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFirstOpen, setIsFirstOpen] = useState("");
  const [isSecondOpen, setIsSecondOpen] = useState("");

  // 3-1. isSidebar ------------------------------------------------------------------------------->
  useEffect(() => {
    if (sidebar) {
      setIsSidebarOpen(sidebar);
    }
  }, [sidebar]);

  // 3-2. isFirstOpen ----------------------------------------------------------------------------->
  const toggleFirstOpen = (menuLabel) => {
    if (menuLabel) {
      setIsFirstOpen(isFirstOpen === menuLabel ? null : menuLabel);
    }
  };

  // 3-3. isSecondOpen ---------------------------------------------------------------------------->
  useEffect(() => {
    if (location.pathname) {
      setIsSecondOpen(location.pathname);
    }
  }, [location.pathname]);

  const sidBarItem = () => (
    <SwipeableDrawer open={isSidebarOpen} onClose={() => (setIsSidebarOpen(false))}
    onOpen={() => (setIsSidebarOpen(true))}>
      <List sx={{width:200}} role={"presentation"} aria-labelledby={"nested-list-subheader"}
      component={"nav"}>
        {dataArray.map((item, index) => (
          <Box key={index} sx={{width:200}}>
            <ListItemButton key={index} onClick={() => (toggleFirstOpen(item.title))}>
              <ListItemIcon>
                <i className={`${item.icon}`}></i>
              </ListItemIcon>
              <ListItemText>
                {item.title}
              </ListItemText>
              {isFirstOpen === item.title ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={isFirstOpen === item.title} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item?.items?.map(({ to, label }) => (
                  <ListItemButton key={to} sx={{pl:4}} onClick={() => {
                    SEND.startDt = koreanDate;
                    SEND.endDt = koreanDate;
                    navParam(to, {
                      state: SEND
                    });
                    setIsSecondOpen(to);
                    onClose();
                  }}>
                    <ListItemText>
                      {label}
                    </ListItemText>
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
      {sidBarItem()}
    </React.Fragment>
  );
};
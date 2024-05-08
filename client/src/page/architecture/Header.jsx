// Header.jsx

import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import moment from "moment-timezone";
import {SideBar} from "./SideBar";
import Grid2 from '@mui/material/Unstable_Grid2';
import {Container, Card, Paper, Box, Menu, MenuItem} from "@mui/material";
import PopupState, {bindTrigger, bindMenu} from "material-ui-popup-state";
import {CustomIcons} from "import/CustomIcons";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navParam = useNavigate();
  const user_id = sessionStorage.getItem("user_id");

  // 2-1. useState -------------------------------------------------------------------------------->
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 4. toggle ------------------------------------------------------------------------------------>
  const openSidebar = () => {
    setIsSidebarOpen((prev) => (!prev));
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const btnSideBar = () => (
    <React.Fragment>
      <CustomIcons name={"MdOutlineMenu"} className={"w-24 h-24 dark"} onClick={openSidebar} />
      <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </React.Fragment>
  );

  // 6-2. button ---------------------------------------------------------------------------------->
  const btnUser = () => (
    <PopupState variant={"popover"} popupId={"popup-menu"}>
      {(popupState) => (
        <React.Fragment>
          <CustomIcons name={"MdOutlineAccountCircle"} {...bindTrigger(popupState)} className={"w-24 h-24 dark"} />
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={() => {
              navParam("/user/login");
            }}>
              Login
            </MenuItem>
            <MenuItem onClick={() => {
              navParam("/user/signup");
            }}>
              Signup
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Paper className={"flex-wrapper h-6vh p-sticky top-0"} variant={"outlined"}>
        <Container className={"p-5"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={2} lg={2} md={2} sm={2} xs={2} className={"d-left"}>
              {btnSideBar()}
            </Grid2>
            <Grid2 xl={8} lg={8} md={8} sm={8} xs={8} className={"d-center"}>
              <span className={"head-text"}>{moment().tz("Asia/Seoul").format(`YYYY-MM-DD (ddd)`)}</span>
            </Grid2>
            <Grid2 xl={2} lg={2} md={2} sm={2} xs={2} className={"d-right"}>
              {btnUser()}
            </Grid2>
          </Grid2>
        </Container>
      </Paper>
    </React.Fragment>
  );
};
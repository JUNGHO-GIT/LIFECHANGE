// Header.jsx

import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import moment from "moment-timezone";
import "moment/locale/ko";
import {Card, Container, Menu, MenuItem} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navParam = useNavigate();
  const user_id = sessionStorage.getItem("user_id");

  // 2-2. useState -------------------------------------------------------------------------------->
  // 사이드바 기본값
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 4. toggle ------------------------------------------------------------------------------------>
  const openSidebar = () => {
    setIsSidebarOpen((prev) => (!prev));
    local
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const btnSideBar = () => (
    <React.Fragment>
      <MenuIcon onClick={openSidebar} />
    </React.Fragment>
  );

  // 6-2. button ---------------------------------------------------------------------------------->
  const btnUser = () => (
    <PopupState variant={"popover"} popupId={"popup-menu"}>
      {(popupState) => (
        <>
          <AccountCircleIcon {...bindTrigger(popupState)} />
          <Menu {...bindMenu(popupState)}>
            <React.Fragment>
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
            </React.Fragment>
          </Menu>
        </>
      )}
    </PopupState>
  );

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"header-wrapper"}>
        <Container>
          <Grid container spacing={3}>
            <Grid xl={2} lg={2} md={2} sm={2} xs={2} className={"d-left"}>
              {btnSideBar()}
            </Grid>
            <Grid xl={8} lg={8} md={8} sm={8} xs={8} className={"d-center"}>
              <span className={"head-text"}>{moment().tz("Asia/Seoul").format(`YYYY-MM-DD (ddd)`)}</span>
            </Grid>
            <Grid xl={2} lg={2} md={2} sm={2} xs={2} className={"d-right"}>
              {btnUser()}
            </Grid>
          </Grid>
        </Container>
      </Card>
    </React.Fragment>
  );
};
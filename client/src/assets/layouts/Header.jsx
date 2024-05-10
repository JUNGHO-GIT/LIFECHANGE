// Header.jsx

import {SideBar} from "./SideBar";
import {React, useState, useNavigate} from "../../import/ImportReacts";
import {moment} from "../../import/ImportLibs";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons";
import {Grid2, Container, Paper, PopupState, bindTrigger, bindMenu, Menu, MenuItem, Box} from "../../import/ImportMuis";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navParam = useNavigate();
  const user_id = sessionStorage.getItem("user_id");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 4. toggle ------------------------------------------------------------------------------------>
  const openSidebar = () => {
    setIsSidebarOpen((prev) => (!prev));
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const btnSideBar = () => (
    <Box className={"d-center"}>
      <CustomIcons name={"MdOutlineMenu"} className={"w-24 h-24 dark"} onClick={openSidebar} />
      <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </Box>
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

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <Paper className={"flex-wrapper h-6vh p-sticky top-0"} variant={"outlined"}>
      <Container className={"p-5"}>
        <Grid2 container spacing={3}>
          <Grid2 xl={2} lg={2} md={2} sm={2} xs={2} className={"d-left"}>
            {btnSideBar()}
          </Grid2>
          <Grid2 xl={8} lg={8} md={8} sm={8} xs={8} className={"d-center"}>
            <span className={"head-text"}>
              {moment().tz("Asia/Seoul").format(`YYYY-MM-DD (ddd)`)}
            </span>
          </Grid2>
          <Grid2 xl={2} lg={2} md={2} sm={2} xs={2} className={"d-right"}>
            {btnUser()}
          </Grid2>
        </Grid2>
      </Container>
    </Paper>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {tableNode()}
    </React.Fragment>
  );
};
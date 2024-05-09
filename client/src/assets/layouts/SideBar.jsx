// SideBar.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {moment} from "../../import/ImportLibs";
import {dataArray} from "../../import/ImportLogics";
import {Box, Button, Collapse, Divider, SwipeableDrawer, List, ListItemButton, ListItemIcon, ListItemText} from "../../import/ImportMuis";
import {CustomIcons} from "../../import/ImportIcons";
import {logo3} from "../../import/ImportImages";

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
    toSignup: "/user/signup"
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
  useEffect(() => {
    const savedFirstOpen = sessionStorage.getItem("isFirstOpen");
    if (savedFirstOpen) {
      setIsFirstOpen(savedFirstOpen);
    }
  }, []);
  useEffect(() => {
    sessionStorage.setItem("isFirstOpen", isFirstOpen);
  }, [isFirstOpen]);

  // 3-2. isSecondOpen ---------------------------------------------------------------------------->
  useEffect(() => {
    if (location.pathname) {
      setIsSecondOpen(location.pathname);
    }
  }, [location.pathname]);

  // 4. sidebarNode ------------------------------------------------------------------------------->
  const sidBarNode = () => (
    <SwipeableDrawer
      open={isSidebarOpen}
      onOpen={() => (setIsSidebarOpen(true))}
      onClose={() => (setIsSidebarOpen(false))}
      className={"sidebar"}
    >
      <Box className={"w-180px"}>
        <Box>
          <img src={logo3} alt={"logo"} className={"sidebar-image-logo"} />
        </Box>
        <List role={"presentation"} component={"nav"} className={"sidebar-ul-text"}>
          {dataArray.map((item, index) => (
            <Box key={index}>
              <ListItemButton
                key={index}
                className={`sidebar-li-text ${isFirstOpen === item.title?"highlight":""}`}
                onClick={() => (toggleFirstOpen(item.title))}
              >
                <ListItemIcon>
                  <CustomIcons name={item.icon} className={"w-24 h-24 dark"} />
                </ListItemIcon>
                <ListItemText>
                  {item.title}
                </ListItemText>
              </ListItemButton>
              <Collapse in={isFirstOpen === item.title} timeout={"auto"} unmountOnExit>
                <List component={"div"} disablePadding>
                  {item?.items?.map(({ to, label }) => (
                    <ListItemButton
                      key={to}
                      className={`sidebar-li2-text ${isSecondOpen === to?"highlight":""}`}
                      onClick={() => {
                        SEND.startDt = koreanDate;
                        SEND.endDt = koreanDate;
                        navParam(to, {
                          state: SEND
                        });
                        setIsSidebarOpen(false);
                        setIsSecondOpen(to);
                      }}
                    >
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
        <Divider />
        <Button variant={"contained"} color={"error"} size={"small"} className={"m-20"}
        onClick={() => (localStorage.clear())}>
          Clear
        </Button>
      </Box>
    </SwipeableDrawer>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {sidBarNode()}
    </React.Fragment>
  );
};
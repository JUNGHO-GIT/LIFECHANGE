// SideBar.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {dataArray} from "../../import/ImportLogics";
import {Div, Hr, Br} from "../../import/ImportComponents.jsx";
import {Button, Collapse, SwipeableDrawer} from "../../import/ImportMuis.jsx";
import {List, ListItemButton, ListItemIcon, ListItemText} from "../../import/ImportMuis.jsx";
import {Icons} from "../../import/ImportIcons.jsx";
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

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <SwipeableDrawer
      open={isSidebarOpen}
      onOpen={() => (setIsSidebarOpen(true))}
      onClose={() => (setIsSidebarOpen(false))}
      className={"sidebar"}
    >
      <Div className={"w-200"}>
        <Div>
          <img src={logo3} alt={"logo"} className={"sidebar-image-logo"} />
        </Div>
        <List role={"presentation"} component={"nav"} className={"sidebar-ul-text"}>
          {dataArray.map((item, index) => (
            <Div key={index}>
              <ListItemButton
                key={index}
                className={`sidebar-li-text ${isFirstOpen === item.title?"highlight":""}`}
                onClick={() => (toggleFirstOpen(item.title))}
              >
                <ListItemIcon>
                  <Icons name={item.icon} className={"w-24 h-24 dark"} />
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
            </Div>
          ))}
        </List>
        <Hr className={"mb-20"} />
        <Button variant={"contained"} color={"error"} size={"small"} className={"m-20"}
        onClick={() => (sessionStorage.clear())}>
          Clear
        </Button>
      </Div>
    </SwipeableDrawer>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
    </>
  );
};
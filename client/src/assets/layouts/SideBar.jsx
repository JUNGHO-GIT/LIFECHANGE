// SideBar.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {dataArray} from "../../import/ImportLogics";
import {Icons, Div} from "../../import/ImportComponents.jsx";
import {Button, Collapse, SwipeableDrawer} from "../../import/ImportMuis.jsx";
import {List, ListItemButton, ListItemIcon, ListItemText} from "../../import/ImportMuis.jsx";
import {logo3} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const SideBar = ({isSidebarOpen, setIsSidebarOpen}) => {

  // 1. common -------------------------------------------------------------------------------------
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navigate = useNavigate();
  const location = useLocation();

  // 2-1. useStorage -------------------------------------------------------------------------------
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    refresh: 0,
    toLogin: "/user/login",
    toSignup: "/user/signup"
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const [isFirstOpen, setIsFirstOpen] = useState("");
  const [isSecondOpen, setIsSecondOpen] = useState("");

  // 3-1. isFirstOpen ------------------------------------------------------------------------------
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

  // 3-2. isSecondOpen -----------------------------------------------------------------------------
  useEffect(() => {
    if (location.pathname) {
      setIsSecondOpen(location.pathname);
    }
  }, [location.pathname]);

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => (
    <SwipeableDrawer
      open={isSidebarOpen}
      onOpen={() => (setIsSidebarOpen(true))}
      onClose={() => (setIsSidebarOpen(false))}
      className={"sidebar"}
    >
      <Div className={"w-200 over-y-hidden"}>
        <Div className={"d-center"}>
          <Img src={logo3} />
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
                  <Icons name={item.icon} className={"w-24 h-24"} />
                </ListItemIcon>
                <ListItemText>
                  {item.title}
                </ListItemText>
              </ListItemButton>
              <Collapse in={isFirstOpen === item.title} timeout={"auto"} unmountOnExit>
                <List component={"div"} disablePadding={true}>
                  {item?.items?.map(({ to, label }) => (
                    <ListItemButton
                      key={to}
                      className={`sidebar-li2-text ${isSecondOpen === to?"highlight":""}`}
                      onClick={() => {
                        Object.assign(SEND, {
                          dateStart: koreanDate,
                          dateEnd: koreanDate
                        });
                        navigate(to, {
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
        <Button variant={"contained"} color={"error"} size={"small"} className={"m-20"}
        onClick={() => (sessionStorage.clear())}>
          Clear
        </Button>
      </Div>
    </SwipeableDrawer>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {LOADING ? loadingFragment() : tableNode()}
    </>
  );
};
// Header.jsx

import {SideBar} from "./SideBar";
import {React, useState, useNavigate} from "../../import/ImportReacts.jsx";
import {PopUp, Div, Icons} from "../../import/ImportComponents.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const user_id = sessionStorage.getItem("user_id") || "{}";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 4. toggle ------------------------------------------------------------------------------------>
  const openSidebar = () => {
    setIsSidebarOpen((prev) => (!prev));
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const btnSideBar = () => (
    <>
    <Icons name={"TbAlignLeft"} className={"w-24 h-24 dark pointer"} onClick={openSidebar}/>
    <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
    </>
  );

  // 6-2. button ---------------------------------------------------------------------------------->
  const btnUser = () => (
    <PopUp
      type={"dropdown"}
      position={"bottom"}
      direction={"left"}
      contents={({closePopup}) => (
        <>
          <Icons name={"TbLogin"} className={"w-24 h-24 dark"} onClick={() => {
            navigate("/user/login");
            setTimeout(() => {
              closePopup();
            }, 1000);
          }}>
            <Div className={"fsr-0-8"}>Login</Div>
          </Icons>
          <Div className={"h-10"}/>
          <Icons name={"TbLogin2"} className={"w-24 h-24 dark"} onClick={() => {
            navigate("/user/signup");
            setTimeout(() => {
              closePopup();
            }, 1000);
          }}>
            <Div className={"fsr-0-8"}>Sign Up</Div>
          </Icons>
        </>
      )}>
      {(popTrigger={}) => (
        <Icons name={"TbUserSquareRounded"} className={"w-24 h-24 dark pointer mb-n5"}
          onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}
        />
      )}
    </PopUp>
  );

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row h-7vh w-100vw"}>
      <Div className={"d-center"}>
        {btnSideBar()}
      </Div>
      <Div className={"d-center ms-auto"}>
        <Div className={"fsr-1-4"}>
          {moment().tz("Asia/Seoul").format(`YYYY-MM-DD (ddd)`)}
        </Div>
      </Div>
      <Div className={"d-center ms-auto"}>
        {btnUser()}
      </Div>
    </Div>
  );

  // 7. header ------------------------------------------------------------------------------------>
  const navbarNode = () => (
    <Paper className={"flex-wrapper p-sticky top-0"}>
      {defaultNode()}
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {navbarNode()}
    </>
  );
};
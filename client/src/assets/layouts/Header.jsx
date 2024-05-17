// Header.jsx

import {SideBar} from "./SideBar";
import {React, useState, useNavigate} from "../../import/ImportReacts.jsx";
import {PopUp, Div, Icons} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";
import {user1, logo2, logo3} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const user_id = sessionStorage.getItem("user_id") || "{}";

  // 2-2. useState -------------------------------------------------------------------------------->
  /* const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 4. toggle
  const openSidebar = () => {
    setIsSidebarOpen((prev) => (!prev));
  };
  // 6-1. button
  const btnSideBar = () => (
    <>
      <Icons name={"TbAlignLeft"} className={"w-24 h-24 pointer"} onClick={openSidebar}/>
      <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
    </>
  ); */

  // 6-2. button ---------------------------------------------------------------------------------->
  const btnUser = () => (
    <PopUp
      type={"dropdown"}
      position={"bottom"}
      direction={"right"}
      contents={({closePopup}) => (
        <>
          <Div className={"d-center pointer mb-10"} onClick={() => {
            navigate("/user/login");
            closePopup();
          }}>
            <Icons name={"TbLogin"} className={"w-24 h-24"} />
            <Div className={"fs-0-8rem"}>Login</Div>
          </Div>
          <Div className={"d-center pointer mb-10"} onClick={() => {
            navigate("/user/signup");
            closePopup();
          }}>
            <Icons name={"TbLogin2"} className={"w-24 h-24"} />
            <Div className={"fs-0-8rem"}>SignUp</Div>
          </Div>
          <Div className={"d-center pointer mb-10"} onClick={() => {
            navigate("/user/data/set");
            closePopup();
          }}>
            <Icons name={"TbUser"} className={"w-24 h-24"} />
            <Div className={"fs-0-8rem"}>DataSet</Div>
          </Div>
          <Div className={"d-center pointer"} onClick={() => {
            navigate("/user/data/list");
            closePopup();
          }}>
            <Icons name={"TbUser"} className={"w-24 h-24"} />
            <Div className={"fs-0-8rem"}>DataList</Div>
          </Div>
        </>
      )}>
      {(popTrigger={}) => (
        <img src={user1} className={"w-24 h-24 pointer"} alt={"user1"} onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}/>
      )}
    </PopUp>
  );

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row h-7vh w-100vw"}>
      <Div className={"d-center ms-0"} onClick={() => navigate("/calendar/list")}>
        <img src={logo2} className={"w-max170 h-max30"} alt="logo2" />
        <img src={logo3} className={"w-max170 h-max30"} alt="logo3" />
      </Div>
      <Div className={"d-center ms-auto"}>
        {btnUser()}
      </Div>
    </Div>
  );

  // 7. header ------------------------------------------------------------------------------------>
  const navbarNode = () => (
    <Paper className={"flex-wrapper p-sticky top-0vh"}>
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
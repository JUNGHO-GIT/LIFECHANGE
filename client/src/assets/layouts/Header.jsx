// Header.jsx

import {SideBar} from "./SideBar";
import {React, useState, useNavigate} from "../../import/ImportReacts.jsx";
import {PopDown, Div} from "../../import/ImportComponents.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {Icons} from "../../import/ImportIcons.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navParam = useNavigate();
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
    <PopDown elementId={`popDown`} contents={
      <>
      <Div className={"d-row align-center pointer"} onClick={() => {
        navParam(`/user/login`);
      }}>
        <Icons name={"TbLogin2"} className={"w-24 h-24 dark"} />
        <p className={"fs-14"}>Login</p>
      </Div>
      <Div className={"d-row align-center pointer"} onClick={() => {
        navParam(`/user/signup`);
      }}>
        <Icons name={"TbLogin2"} className={"w-24 h-24 dark"} />
        <p className={"fs-14"}>Signup</p>
      </Div>
      </>
    }>
      {popProps => (
        <Icons name={"TbUserSquareRounded"} className={"w-24 h-24 dark pointer mb-n5"}
          onClick={(e) => {
            popProps.openPopup(e.currentTarget)
          }}
        />
      )}
    </PopDown>
  );

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <Paper className={"flex-wrapper h-50 p-sticky top-0 shadow-none border-bottom"}>
      <Div className={"d-center w-100p m-auto"}>
        <Div className={"d-center ms-10"}>
          {btnSideBar()}
        </Div>
        <Div className={"d-center ms-auto"}>
          <span className={"head-text"}>
            {moment().tz("Asia/Seoul").format(`YYYY-MM-DD (ddd)`)}
          </span>
        </Div>
        <Div className={"d-center ms-auto me-10"}>
          {btnUser()}
        </Div>
      </Div>
    </Paper>
  );


  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
    </>
  );
};
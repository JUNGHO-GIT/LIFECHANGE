// Header.jsx

import {React, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {Div, Img} from "../../import/ImportComponents.jsx";
import {Paper, Card} from "../../import/ImportMuis.jsx";
import {logo2, logo3, setting1, setting4} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const location = useLocation();
  const PATH = location.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 6-2. button ---------------------------------------------------------------------------------->
  const btnUser = () => (
    secondStr === "data" && thirdStr === "main" ? (
      <Img src={setting4} className={"w-24 h-24 pointer m-0"} onClick={() => {
        navigate("/")
      }}/>
    ) : (
      <Img src={setting1} className={"w-24 h-24 pointer m-0"} onClick={() => {
        navigate("/user/data/main")
      }}/>
    )
  );

  {/* <PopUp
    type={"dropdown"}
    position={"bottom"}
    direction={"center"}
    contents={({closePopup}) => (
      <Div className={"d-column align-left p-5"}>
        {!sessionId ? (
          <>
          <Div className={"d-center pointer"} onClick={() => {
            navigate("/user/login");
            closePopup();
          }}>
            <Icons name={"TbLogin"} className={"w-24 h-24"} onClick={() => {}} />
            {translate("header-login")}
          </Div>
          <Div className={"d-center pointer"} onClick={() => {
            navigate("/user/signup");
            closePopup();
          }}>
            <Icons name={"TbLogin2"} className={"w-24 h-24"} onClick={() => {}} />
            {translate("header-signup")}
          </Div>
          </>
        ) : (
          <>
          <Div className={"d-center pointer"} onClick={() => {
            navigate("/");
            sessionStorage.removeItem("sessionId");
            closePopup();
          }}>
            <Icons name={"TbLogout"} className={"w-24 h-24"} onClick={() => {}} />
            {translate("header-logout")}
          </Div>
          </>
        )}
        <Div className={"d-center pointer"} onClick={() => {
          navigate("/user/data/custom");
          closePopup();
        }}>
          <Icons name={"TbUser"} className={"w-24 h-24"} onClick={() => {}} />
          {translate("header-dataCustom")}
        </Div>
        <Div className={"d-center pointer"} onClick={() => {
          navigate("/user/data/list");
          closePopup();
        }}>
          <Icons name={"TbUser"} className={"w-24 h-24"} onClick={() => {}} />
          {translate("header-dataList")}
        </Div>
      </Div>
    )}>
    {(popTrigger={}) => (
      <Icons name={"TbAlignRight"} className={"w-24 h-24 black"}
        onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}
      />
    )}
  </PopUp> */}

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"d-between w-100p"}>
      <Div className={"d-center"}>
        <Img src={logo2} className={"h-max30"} />
        <Img src={logo3} className={"h-max30"} />
      </Div>
      <Div className={"d-center ms-auto"}>
        {btnUser()}
      </Div>
    </Div>
  );

  // 7. header ------------------------------------------------------------------------------------>
  const navbarNode = () => (
    <Paper className={"flex-wrapper p-sticky top-0vh radius border"}>
      <Card className={"block-wrapper d-row h-7vh"}>
        {defaultNode()}
      </Card>
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {navbarNode()}
    </>
  );
};
// Header.jsx

import {React, useNavigate} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {PopUp, Div, Img, Icons} from "../../import/ImportComponents.jsx";
import {Paper, Card} from "../../import/ImportMuis.jsx";
import {logo2, logo3} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const {translate} = useTranslate();
  const sessionId = sessionStorage.getItem("sessionId");

  // 6-2. button ---------------------------------------------------------------------------------->
  const btnUser = () => (
    <PopUp
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
              <Icons name={"TbLogin"} className={"w-24 h-24"} />
              {translate("header-login")}
            </Div>
            <Div className={"d-center pointer"} onClick={() => {
              navigate("/user/signup");
              closePopup();
            }}>
              <Icons name={"TbLogin2"} className={"w-24 h-24"} />
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
              <Icons name={"TbLogout"} className={"w-24 h-24"} />
              {translate("header-logout")}
            </Div>
            </>
          )}
          <Div className={"d-center pointer"} onClick={() => {
            navigate("/user/data/set");
            closePopup();
          }}>
            <Icons name={"TbUser"} className={"w-24 h-24"} />
            {translate("header-dataSet")}
          </Div>
          <Div className={"d-center pointer"} onClick={() => {
            navigate("/user/data/list");
            closePopup();
          }}>
            <Icons name={"TbUser"} className={"w-24 h-24"} />
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
    </PopUp>
  );

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
    <Paper className={"flex-wrapper p-sticky top-0vh radius border shadow-bottom"}>
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
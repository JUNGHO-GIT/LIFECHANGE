// Header.jsx

import {React, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {Div, Img, Icons} from "../../import/ImportComponents.jsx";
import {Paper, Card} from "../../import/ImportMuis.jsx";
import {logo2, logo3} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const location = useLocation();
  const PATH = location.pathname;
  const firstStr = PATH?.split("/")[1] || "";

  // 6-2. button ---------------------------------------------------------------------------------->
  const btnUser = () => (
    firstStr !== "user" ? (
      <Icons name={"TbSettings"} className={"w-24 h-24 black m-0"} onClick={() => {
        navigate("/user/setting");
      }}/>
    ) : (
      <Icons name={"TbArrowRight"} className={"w-24 h-24 black m-0"} onClick={() => {
        navigate(-1);
      }}/>
    )
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
    <Paper className={"flex-wrapper p-sticky top-0vh radius border"}>
      <Card className={"block-wrapper d-row h-8vh"}>
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
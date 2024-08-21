// Header.jsx

import { React } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { Div, Img, Icons } from "../../import/ImportComponents.jsx";
import { Paper, Card } from "../../import/ImportMuis.jsx";
import { logo2, logo3 } from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const Header = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, firstStr, koreanDate,
  } = useCommon();

  // 6-2. button -----------------------------------------------------------------------------------
  const btnUser = () => (
    firstStr !== "user" ? (
      <Icons name={"TbSettings"} className={"w-24 h-24 black m-0"} onClick={() => {
        navigate("/user/app/setting");
      }}/>
    ) : (
      <Icons name={"TbArrowRight"} className={"w-24 h-24 black m-0"} onClick={() => {
        navigate(-1);
      }}/>
    )
  );

  // 6. default ------------------------------------------------------------------------------------
  const defaultNode = () => (
    <Div className={"d-between w-100p"}>
      <Div className={"d-center"}>
        <Img
          src={logo2}
          className={"h-max30"}
          onClick={(e) => {
            navigate("/today/list", {
              state: {
                dateType: "day",
                dateStart: koreanDate,
                dateEnd: koreanDate,
              }
            });
          }}
        />
        <Img src={logo3} className={"h-max30"} />
      </Div>
      <Div className={"d-center ms-auto"}>
        {btnUser()}
      </Div>
    </Div>
  );

  // 7. header -------------------------------------------------------------------------------------
  const navbarNode = () => (
    <Paper className={"flex-wrapper p-sticky top-0vh radius border shadow-none"}>
      <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
        {defaultNode()}
      </Card>
    </Paper>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
    {navbarNode()}
    </>
  );
};
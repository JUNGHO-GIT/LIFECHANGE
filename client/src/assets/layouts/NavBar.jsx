// NavBar.jsx

import {React, useState, useLocation, useEffect} from "../../import/ImportReacts.jsx";
import {dataArray} from "../../import/ImportLogics";
import {Div} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";
import {smile1, smile2, smile3, smile4} from "../../import/ImportImages";

// ------------------------------------------------------------------------------------------------>
export const NavBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();
  const percent = JSON.parse(sessionStorage.getItem("percent") || "{}");
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const planStr = PATH?.split("/")[3] ? "plan" : "";
  const part = partStr.charAt(0).toUpperCase() + partStr.slice(1);
  const type = typeStr.charAt(0).toUpperCase() + typeStr.slice(1);
  const plan = planStr.charAt(0).toUpperCase() + planStr.slice(1);

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isActive, setIsActive] = useState(PATH);

  // 3-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setIsActive(location.pathname);
  }, [location.pathname]);

  let preFix = "";
  let subFix = isActive.split("/").pop();

  dataArray.forEach((menu) => {
    if (isActive.includes(menu.title.toLowerCase())) {
      preFix = menu.title;
    }
  });

  // 3. logic ------------------------------------------------------------------------------------->
  const makeIcon = (label) => {
    if (percent?.[`${label}`] < 2) {
      return (
        <img src={smile1} className={"w-max5vw h-max5vh"} alt="smile1" />
      );
    }
    else if (percent?.[`${label}`] < 3) {
      return (
        <img src={smile2} className={"w-max5vw h-max5vh"} alt="smile2" />
      );
    }
    else if (percent?.[`${label}`] < 4) {
      return (
        <img src={smile3} className={"w-max5vw h-max5vh"} alt="smile3" />
      );
    }
    else {
      return (
        <img src={smile4} className={"w-max5vw h-max5vh"} alt="smile4" />
      );
    }
  };

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row h-7vh w-100vw"}>
      <Div className={"d-center"}>
        <Div className={"fsr-1-2 fw-bold"}>
          {part}
          {type ? ` / ${type}` : ""}
          {plan ? ` / ${plan}` : ""}
        </Div>
      </Div>
      <Div className={"d-center ms-auto"}>
        <Div className={"d-center"}>{makeIcon("total")}</Div>
        <Div className={"w-5"}></Div>
        <Div className={"d-center"}>{makeIcon("sub")}</Div>
      </Div>
    </Div>
  );

  // 7. navbar ------------------------------------------------------------------------------------>
  const navbarNode = () => (
    <Paper className={"flex-wrapper p-sticky top-7vh"}>
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
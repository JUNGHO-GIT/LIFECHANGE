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
      return <img src={smile1} className={"nav-image-smile"} alt="Icon 1" />;
    }
    else if (percent?.[`${label}`] < 3) {
      return <img src={smile2} className={"nav-image-smile"} alt="Icon 2" />;
    }
    else if (percent?.[`${label}`] < 4) {
      return <img src={smile3} className={"nav-image-smile"} alt="Icon 3" />;
    }
    else {
      return <img src={smile4} className={"nav-image-smile"} alt="Icon 4" />;
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <Paper className={"flex-wrapper h-40 p-sticky top-40 border-bottom"}>
      <Div className={"d-flex w-100p m-auto"}>
        <Div className={"d-center ms-10"}>
          <span className={"nav-icon-text"}>Total</span>
          <span className={"w-5"}></span>
          <span className={"nav-image-smile"}>{makeIcon("total")}</span>
        </Div>
        <Div className={"d-center ms-auto"}>
          {!preFix ? (
            <span className={"nav-text"}>Home</span>
          ) : (
            <span className={"nav-text"}>{preFix} / {subFix}</span>
          )}
        </Div>
        <Div className={"d-center ms-auto me-10"}>
          <span className={"nav-icon-text"}>{`${preFix}`}</span>
          <span className={"w-5"}></span>
          <span className={"nav-image-smile"}>{makeIcon("sub")}</span>
        </Div>
      </Div>
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
    </>
  );
};
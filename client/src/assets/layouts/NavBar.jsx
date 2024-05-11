// NavBar.jsx

import {React, useState, useLocation, useEffect} from "../../import/ImportReacts.jsx";
import {dataArray} from "../../import/ImportLogics";
import {Grid2, Container, Card, Paper, Box, Typography} from "../../import/ImportMuis.jsx";
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
    <Paper className={"flex-wrapper h-6vh p-sticky top-35"} variant={"outlined"}>
      <Container className={"p-5"}>
        <Grid2 container spacing={3}>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6} className={"d-center ps-0 pe-0"}>
            {!preFix ? (
              <span className={"nav-text"}>Home</span>
            ) : (
              <span className={"nav-text"}>{preFix} / {subFix}</span>
            )}
          </Grid2>
          <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"d-left ps-0 pe-0"}>
            <span className={"nav-icon-text"}>Total</span>
            <span className={"w-1vw"}></span>
            <span className={"nav-image-smile"}>{makeIcon("total")}</span>
          </Grid2>
          <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"d-left ps-0 pe-0"}>
            <span className={"nav-icon-text"}>{`${preFix}`}</span>
            <span className={"w-1vw"}></span>
            <span className={"nav-image-smile"}>{makeIcon("sub")}</span>
          </Grid2>
        </Grid2>
      </Container>
    </Paper>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
    </>
  );
};
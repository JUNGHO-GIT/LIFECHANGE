// NavBar.jsx

import {React, useState, useLocation, useEffect} from "../../import/ImportReacts";
import {dataArray} from "../../import/ImportLogics";
import {Grid2, Container, Card, Paper, Box, Menu, MenuItem} from "../../import/ImportMuis";
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

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Paper className={"flex-wrapper h-6vh p-sticky top-35"} variant={"outlined"}>
        <Container className={"p-5"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={4} lg={4} md={4} sm={4} xs={4} className={"d-left"}>
              <span className={"nav-icon-text"}>Total</span>
              <span className={"w-1vw"}></span>
              <span className={"nav-image-smile"}>{makeIcon("total")}</span>
            </Grid2>
            <Grid2 xl={4} lg={4} md={4} sm={4} xs={4} className={"d-center"}>
              {!preFix ? (
                <span className={"nav-text"}>Home</span>
              ) : (
                <span className={"nav-text"}>{preFix} / {subFix}</span>
              )}
            </Grid2>
            <Grid2 xl={4} lg={4} md={4} sm={4} xs={4} className={"d-right"}>
              <span className={"nav-icon-text"}>{`${preFix}`}</span>
              <span className={"w-1vw"}></span>
              <span className={"nav-image-smile"}>{makeIcon("sub")}</span>
            </Grid2>
          </Grid2>
        </Container>
      </Paper>
    </React.Fragment>
  );
};
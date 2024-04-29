// NavBar.jsx

import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {dataArray} from "../assets/data/DataArray.jsx";
import {Container, Row, Col, Card} from "react-bootstrap";
// @ts-ignore
import smile1 from "../assets/images/smile1.png";
// @ts-ignore
import smile2 from "../assets/images/smile2.png";
// @ts-ignore
import smile3 from "../assets/images/smile3.png";
// @ts-ignore
import smile4 from "../assets/images/smile4.png";

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

  // 3. function ---------------------------------------------------------------------------------->
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

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper mb-10"}>
        <Card className={"container-wrapper"}>
          <Container fluid className={"p-0"}>
            <Row>
              <Col lg={6} md={6} sm={4} xs={4} className={"d-left"}>
                {!preFix ? (
                  <span className={"nav-text"}>Home</span>
                ) : (
                  <span className={"nav-text"}>{preFix} / {subFix}</span>
                )}
              </Col>
              <Col lg={3} md={3} sm={4} xs={4} className={"d-left"}>
                <span className={"nav-icon-text"}>{`Total`}</span>
                <span className={"nav-icon-text"}>{makeIcon("total")}</span>
              </Col>
              <Col lg={3} md={3} sm={4} xs={4} className={"d-left"}>
                <span className={"nav-icon-text"}>{`${preFix}`}</span>
                <span className={"nav-icon-text"}>{makeIcon(`${preFix?.toLowerCase()}`)}</span>
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
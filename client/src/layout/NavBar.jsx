// NavBar.jsx

import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {dataArray} from "../assets/data/DataArray.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// @ts-ignore
import img1 from "../assets/images/1.png";
// @ts-ignore
import img2 from "../assets/images/2.png";
// @ts-ignore
import img3 from "../assets/images/3.png";
// @ts-ignore
import img4 from "../assets/images/4.png";

// ------------------------------------------------------------------------------------------------>
export const NavBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();
  const percent = JSON.parse(window.sessionStorage.getItem("percent") || "{}");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isActive, setIsActive] = useState(PATH);

  // 3-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setIsActive(location.pathname);
  }, [location.pathname]);

  let preFix;
  let subFix = isActive.split("/").pop();

  dataArray.forEach((menu) => {
    if (isActive.includes(menu.label.toLowerCase())) {
      preFix = menu.label;
    }
  });

  // 3. function ---------------------------------------------------------------------------------->
  const makeIcon = (label) => {
    if (percent?.[`${label}`] < 2) {
      return <img src={img1} className={"image"} alt="Icon 1" />;
    }
    else if (percent?.[`${label}`] < 3) {
      return <img src={img2} className={"image"} alt="Icon 2" />;
    }
    else if (percent?.[`${label}`] < 4) {
      return <img src={img3} className={"image"} alt="Icon 3" />;
    }
    else {
      return <img src={img4} className={"image"} alt="Icon 4" />;
    }
  };

  // 4. node -------------------------------------------------------------------------------------->
  const buttonClear = () => {
    return (
      <React.Fragment>
        <Button variant={"danger"} size={"sm"} className={"me-5"} onClick={() => (
          localStorage.clear()
        )}>
          Clear
        </Button>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper mb-10"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container fluid className={"p-0"}>
            <Row>
              <Col xs={2} className={"d-left"}>
                {!preFix ? (
                  <span className={"fs-30 fw-500 ps-30 pt-10"}>Home</span>
                ) : (
                  <span className={"fs-30 fw-500 ps-30 pt-10"}>{preFix} / {subFix}</span>
                )}
              </Col>
              <Col xs={8} className={"d-center"}>
                <Row>
                  <Col xs={4} className={"d-center"}>
                    <span>Total </span> {makeIcon("total")}
                  </Col>
                  <Col xs={2} className={"d-center"}>
                    <span>Food </span> {makeIcon("food")}
                  </Col>
                  <Col xs={2} className={"d-center"}>
                    <span>Money </span> {makeIcon("money")}
                  </Col>
                  <Col xs={2} className={"d-center"}>
                    <span>Sleep </span> {makeIcon("sleep")}
                  </Col>
                  <Col xs={2} className={"d-center"}>
                    <span>Exercise </span> {makeIcon("exercise")}
                  </Col>
                </Row>
              </Col>
              <Col xs={2} className={"d-right"}>
                {buttonClear()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
// NavBar.jsx

import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {dataArray} from "../assets/data/DataArray.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

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
  let subFix = isActive.split("/")[1];

  dataArray.forEach((menu) => {
    if (isActive.includes(menu.label.toLowerCase())) {
      preFix = menu.label;
    }
  });

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
              <Col xs={3} className={"d-left"}>
                {!preFix ? (
                  <span className={"fs-30 fw-500 ps-30 pt-10"}>Home</span>
                ) : (
                  <span className={"fs-30 fw-500 ps-30 pt-10"}>{preFix} / {subFix}</span>
                )}
              </Col>
              <Col xs={6} className={"d-center"}>
                Food : <span className={`${percent?.food?.color}`}>{percent?.food?.value}</span>
                &nbsp;|&nbsp;
                Money : <span className={`${percent?.money?.color}`}>{percent?.money?.value}</span>
                &nbsp;|&nbsp;
                Work : <span className={`${percent?.work?.color}`}>{percent?.work?.value}</span>
                &nbsp;|&nbsp;
                Sleep : <span className={`${percent?.sleep?.color}`}>{percent?.sleep?.value}</span>
              </Col>
              <Col xs={3} className={"d-right"}>
                {buttonClear()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
// NavBar.jsx

import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {dataArray} from "../assets/data/DataArray.jsx";
import {Container, Table, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const NavBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();

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
              <Col xs={6} className={"d-left"}>
                <span className={"fs-30 fw-500 ps-30 pt-10"}>{preFix} / {subFix}</span>
              </Col>
              <Col xs={6} className={"d-right"}>
                {buttonClear()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
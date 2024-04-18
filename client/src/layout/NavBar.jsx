// NavBar.jsx

import React, {useState, useEffect} from "react";
import moment from "moment-timezone";
import {useNavigate, useLocation} from "react-router-dom";
import {dataArray} from "../assets/data/DataArray.jsx";
import {useStorage} from "../assets/hooks/useStorage.jsx";
import {useDeveloperMode} from "../assets/hooks/useDeveloperMode.jsx";
import {Container, Table, FormGroup, Form, ButtonGroup, Button, CardGroup, Card, Row, Col, Collapse} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const NavBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {isDeveloperMode, toggleDeveloperMode} = useDeveloperMode();
  const {val:SEND, set:setSEND} = useStorage (
    `SEND(${PATH})`, {
      id: "",
      date: koreanDate,
      refresh: 0,
      toLogin: "/user/login",
      toSignup: "/user/signup",
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isSidebar, setIsSidebar] = useState(true);
  const [isActive, setIsActive] = useState(PATH);
  const [isExpended, setIsExpended] = useState({});

  // 3-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setIsActive(location.pathname);
  }, [location.pathname]);

  const toggleExpand = (menuLabel) => {
    setIsExpended(isExpended === menuLabel ? null : menuLabel);
  };

  // 4. navBar ------------------------------------------------------------------------------------>
  const navBarNode = () => {

    let preFix;
    let subFix = isActive.split("/")[1];

    dataArray.forEach((menu) => {
      if (isActive.includes(menu.label.toLowerCase())) {
        preFix = menu.label;
      }
    });

    function buttonClear () {
      return (
        <p className={"btn btn-sm btn-danger me-2 pointer"} onClick={() => {
          localStorage.clear();
        }}>
          Clear
        </p>
      );
    };

    return (
      <FormGroup className={"d-flex justify-content-between align-items-center"}>
        <Form className={"text-start"}>
          <h1 className={"fs-30 fw-500 ps-30"}>{preFix} / {subFix}</h1>
        </Form>
        <Form className={"text-end d-flex"}>
          {buttonClear()}
        </Form>
      </FormGroup>
    );
  };

  return (
    <React.Fragment>
      <CardGroup className={"root-wrapper mb-10"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container fluid className={"p-0"}>
            <Row className={"d-center"}>
              <Col xs={12}>
                {navBarNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </CardGroup>
    </React.Fragment>
  );
};
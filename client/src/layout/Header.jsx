// Header.jsx

import {SideBar} from "./SideBar.jsx";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import moment from "moment-timezone";
import {useDeveloperMode} from "../hooks/useDeveloperMode.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navParam = useNavigate();
  const customer_id = sessionStorage.getItem("customer_id");

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {isDeveloperMode, toggleDeveloperMode} = useDeveloperMode();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isSidebar, setIsSidebar] = useState(true);

  // 4. toggle ------------------------------------------------------------------------------------>
  const toggleSidebar = () => {
    setIsSidebar((prev) => (!prev));
  };
  const handleCloseSidebar = () => {
    setIsSidebar(false);
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const buttonNode1 = () => {
    const btnSideBar = () => (
      <Button type={"button"} size={"sm"} className={"dark-btn"} onClick={toggleSidebar}>
        Sidebar
      </Button>
    );
    return (
      <React.Fragment>
        <span className={"w-1vw"}></span>
        <SideBar sidebar={isSidebar} onClose={handleCloseSidebar} />
        {btnSideBar()}
      </React.Fragment>
    );
  };
  // 6-2. button ---------------------------------------------------------------------------------->
  const buttonNode2 = () => {
    const btnLogIn = () => (
      <Button size={"sm"} className={"dark-btn"} onClick={() => {
        navParam("/customer/login");
      }}>
        Login
      </Button>
    );
    const btnSignUp = () => (
      <Button size={"sm"} className={"dark-btn"} onClick={() => {
        navParam("/customer/signup");
      }}>
        Signup
      </Button>
    );
    const btnLogOut = () => (
      <Button size={"sm"} className={"dark-btn"} onClick={() => {
        sessionStorage.clear();
        sessionStorage.setItem("customer_id", "false");
        navParam("/diary/list");
      }}>
        Logout
      </Button>
    );
    return (
      (!customer_id || customer_id === "false") ? (
        <React.Fragment>
          {btnLogIn()}
          {btnSignUp()}
          <span className={"w-1vw"}></span>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {btnLogOut()}
          <span className={"w-1vw"}></span>
        </React.Fragment>
      )
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"border-0"}>
        <Container fluid>
          <Row className={"w-100vw"}>
            <Col lg={3} md={3} sm={3} xs={3} className={"d-left"}>
              {buttonNode1()}
            </Col>
            <Col lg={6} md={6} sm={6} xs={6} className={"d-center"}>
              <span className={"head-text"}>{moment().format("YYYY-MM-DD")}</span>
            </Col>
            <Col lg={3} md={3} sm={3} xs={3} className={"d-right"}>
              {buttonNode2()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
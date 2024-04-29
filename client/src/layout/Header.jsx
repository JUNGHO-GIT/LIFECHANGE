// Header.jsx

import {SideBar} from "./SideBar.jsx";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import moment from "moment-timezone";
import {useDeveloperMode} from "../assets/hooks/useDeveloperMode.jsx";
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
  const buttonNode = () => {
    function btnLogIn () {
      return (
        <Button variant={"secondary"} size={"sm"} className={"me-5"} onClick={() => {
          navParam("/customer/login");
        }}>
          Login
        </Button>
      );
    };
    function btnSignUp () {
      return (
        <Button variant={"secondary"} size={"sm"} className={"me-2"} onClick={() => {
          navParam("/customer/signup");
        }}>
          Signup
        </Button>
      );
    };
    function btnLogOut () {
      return (
        <Button variant={"secondary"} size={"sm"} className={"me-5"} onClick={() => {
          sessionStorage.clear();
          sessionStorage.setItem("customer_id", "false");
          window.location.reload();
        }}>
          Logout
        </Button>
      );
    };
    return (
      (!customer_id || customer_id === "false") ? (
        <React.Fragment>
          {btnLogIn()}
          {btnSignUp()}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {btnLogOut()}
        </React.Fragment>
      )
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"container-wrapper mb-10"}>
        <Container fluid className={"p-0"}>
          <Row>
            <Col lg={3} md={3} sm={3} xs={3} className={"d-left"}>
              <SideBar sidebar={isSidebar} onClose={handleCloseSidebar} />
              <Button type={"button"} size={"sm"} variant={"secondary"} onClick={toggleSidebar}>
                Sidebar
              </Button>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6} className={"d-center"}>
              <span className={"head-text"}>{moment().format("YYYY-MM-DD")}</span>
            </Col>
            <Col lg={3} md={3} sm={3} xs={3} className={"d-right"}>
              {buttonNode()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
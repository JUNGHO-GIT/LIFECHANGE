// Header.jsx

import {SideBar} from "./SideBar.jsx";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDeveloperMode} from "../assets/hooks/useDeveloperMode.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navParam = useNavigate();
  const customer_id = window.sessionStorage.getItem("customer_id");

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {isDeveloperMode, toggleDeveloperMode} = useDeveloperMode();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isSidebar, setIsSidebar] = useState(true);

  // 4. toggle ------------------------------------------------------------------------------------>
  const toggleSidebar = () => {
    setIsSidebar(prev => !prev);
  };
  const handleCloseSidebar = () => {
    setIsSidebar(false);
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const buttonNode = () => {
    function btnDevMode() {
      return (
        <Button variant={isDeveloperMode ? "secondary" : ""} size={"sm"} className={"me-2"}
        onClick={() => {
          toggleDeveloperMode();
        }}>
          Dev
        </Button>
      );
    };
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
          window.sessionStorage.clear();
          window.sessionStorage.setItem("customer_id", "false");
          window.location.reload();
        }}>
          Logout
        </Button>
      );
    };
    return (
      (!customer_id || customer_id === "false") ? (
        <React.Fragment>
          {btnDevMode()}
          {btnLogIn()}
          {btnSignUp()}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {btnDevMode()}
          {btnLogOut()}
        </React.Fragment>
      )
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"container-wrapper mb-10"} border={"light"}>
        <Container fluid className={"p-0"}>
          <Row>
            <Col xs={1}>
              <SideBar sidebar={isSidebar} onClose={handleCloseSidebar} />
              <Button type={"button"} size={"sm"} variant={"secondary"} onClick={toggleSidebar}>
                Sidebar
              </Button>
            </Col>
            <Col xs={9}></Col>
            <Col xs={2}>
              {buttonNode()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
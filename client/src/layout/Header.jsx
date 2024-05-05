// Header.jsx

import {SideBar} from "./SideBar.jsx";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import moment from "moment-timezone";
import "moment/locale/ko";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navParam = useNavigate();
  const user_id = sessionStorage.getItem("user_id");

  // 2-2. useState -------------------------------------------------------------------------------->
  // 사이드바 기본값
  const [isSidebar, setIsSidebar] = useState(false);

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
        navParam("/user/login");
      }}>
        Login
      </Button>
    );
    const btnSignUp = () => (
      <Button size={"sm"} className={"dark-btn"} onClick={() => {
        navParam("/user/signup");
      }}>
        Signup
      </Button>
    );
    const btnLogOut = () => (
      <Button size={"sm"} className={"dark-btn"} onClick={() => {
        sessionStorage.clear();
        sessionStorage.setItem("user_id", "false");
        navParam("/calendar/list");
      }}>
        Logout
      </Button>
    );
    return (
      (!user_id || user_id === "false") ? (
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

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"header-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container fluid={true}>
            <Row>
              <Col lg={3} md={3} sm={3} xs={3} className={"d-left"}>
                {buttonNode1()}
              </Col>
              <Col lg={6} md={6} sm={6} xs={6} className={"d-center"}>
                <span className={"head-text"}>{moment().tz("Asia/Seoul").format(`YYYY-MM-DD (ddd)`)}</span>
              </Col>
              <Col lg={3} md={3} sm={3} xs={3} className={"d-right"}>
                {buttonNode2()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
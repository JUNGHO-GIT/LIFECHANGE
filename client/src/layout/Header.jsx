// Header.jsx

import React, {useState, useEffect} from "react";
import moment from "moment-timezone";
import {useNavigate, useLocation} from "react-router-dom";
import {dataArray} from "../assets/data/DataArray.jsx";
import {useStorage} from "../assets/hooks/useStorage.jsx";
import {useDeveloperMode} from "../assets/hooks/useDeveloperMode.jsx";
import {Container, Table, FormGroup, Form, ButtonGroup, Button, Row, Col, Collapse} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

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

  // 4. sideBar ----------------------------------------------------------------------------------->
  const sideBarNode = () => {

    let preFix;
    let lowFix;

    dataArray.forEach((menu) => {
      if (isActive.includes(menu.label.toLowerCase())) {
        preFix = menu.label;
        lowFix = preFix.toLowerCase()
      }
    });

    function sidBarItem (label, items) {
      return (
        <li className={"text-start pointer mt-30 ps-20"}>
          <Form className={`${isActive === label ? "highlight" : ""}`} onClick={() => (
            toggleExpand(label)
          )}>
            {label}
          </Form>
          <Collapse in={isExpended === label}>
            <ul>
              {items?.map(({ to, label }) => (
                <li key={to} className={`fs-14 fw-400 ${isActive === to ? "highlight" : ""}`}>
                  <Form className={"pointer"} onClick={() => {
                    SEND.startDt = koreanDate;
                    SEND.endDt = koreanDate;
                    navParam(to, {
                      state: SEND
                    });
                    setIsSidebar(false)
                    setIsActive(to);
                  }}>
                    {label}
                  </Form>
                </li>
              ))}
            </ul>
          </Collapse>
        </li>
      );
    };

    return (
      <Form className={`sidebar ${isSidebar ? "sidebar-open" : "sidebar-closed"} bg-white rounded box-right`}>
        <Form className={"d-flex justify-content-between align-items-center text-dark pointer p-10"}>
          <h3 className={"ps-20"}>Changer</h3>
          <p className={"pt-10 pe-10"} onClick={() => setIsSidebar(!isSidebar)}>X</p>
        </Form>
        <Form className={"d-flex flex-column p-3"}>
          <ul className={"nav nav-pills flex-column mb-auto fs-20 fw-500 text-dark"}>
            {dataArray?.map((menu) => (
              sidBarItem(menu.label, menu.items)
            ))}
          </ul>
        </Form>
      </Form>
    );
  };

  // 4-3. view ------------------------------------------------------------------------------------>
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
      <Form className={"d-flex justify-content-between align-items-center"}>
        <Form className={"text-start"}>
          <h1 className={"fs-30 fw-500 ps-30"}>{preFix} / {subFix}</h1>
        </Form>
        <Form className={"text-end d-flex"}>
          {buttonClear()}
        </Form>
      </Form>
    );
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const loginNode = () => {
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
        <Button variant={""} size={"sm"} className={"me-5"} onClick={() => {
          navParam("/user/login");
        }}>
          Login
        </Button>
      );
    };
    function btnSignUp () {
      return (
        <Button variant={""} size={"sm"} className={"me-2"} onClick={() => {
          navParam("/user/signup");
        }}>
          Signup
        </Button>
      );
    };
    function btnLogOut () {
      return (
        <Button variant={""} size={"sm"} className={"me-5"} onClick={() => {
          sessionStorage.setItem("user_id", "false");
          window.location.reload();
        }}>
          Logout
        </Button>
      );
    };
    return (
      (!user_id || user_id === "false") ? (
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
    <FormGroup>
      <Container fluid className={"container-wrapper"}>
        <Row className={"row d-center pt-15 pb-15"}>
          <Col xs={1}>
            {sideBarNode()}
            <Button type={"button"} size={"sm"} variant={"secondary"} onClick={() => {
              setIsSidebar(!isSidebar);
            }}>
              Sidebar
            </Button>
          </Col>
          <Col xs={7}></Col>
          <Col xs={3}>
            {loginNode()}
          </Col>
        </Row>
      </Container>
      <Form className={"h-3"}></Form>
      <Form className={"root-wrapper"}>
        <Container fluid className={"container-wrapper"}>
          <Row className={"row d-center"}>
            <Col xs={12}>
              {navBarNode()}
            </Col>
          </Row>
        </Container>
      </Form>
    </FormGroup>
  );
};
// UserLogin.jsx

import axios from "axios";
import moment from "moment-timezone";
import InputMask from "react-input-mask";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {percent} from "../../assets/js/percent.js";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CUSTOMER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowUserLogin = async () => {
    const response = await axios.post (`${URL_OBJECT}/login`, {
      user_id: user_id,
      user_pw: user_pw,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      sessionStorage.setItem("user_id", user_id);
      sessionStorage.setItem("dataset", JSON.stringify(response.data.result.user_dataset));
      percent();
      navParam("/calendar/list");
    }
    else {
      alert(response.data.msg);
      sessionStorage.setItem("user_id", "false");
    }
  };

  // 4. table ------------------------------------------------------------------------------------->
  const tableUserLogin = () => {
    return (
      <div>
        <div className={"input-group"}>
          <span className={"input-group-text"}>ID</span>
          <InputMask
            mask={""}
            type={"text"}
            className={"form-control"}
            value={user_id}
            onChange={(e) => (
              setUserId(e.target.value)
            )}
          ></InputMask>
        </div>
        <div className={"input-group"}>
          <span className={"input-group-text"}>PW</span>
          <InputMask
            mask={""}
            type={"text"}
            className={"form-control"}
            value={user_pw}
            onChange={(e) => (
              setUserPw(e.target.value)
            )}
          ></InputMask>
        </div>
      </div>
    );
  };

  // 11. button ----------------------------------------------------------------------------------->
  const buttonUserLogin = () => {
    return (
      <React.Fragment>
        <Button size={"sm"} className={"primary-btn"} onClick={() => {
          flowUserLogin();
        }}>
          Log In
        </Button>
      </React.Fragment>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <React.Fragment>
        <Button size={"sm"} className={"success-btn"} onClick={() => {
          navParam(0);
        }}>
          Refresh
        </Button>
      </React.Fragment>
    );
  };

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"card-wrapper"}>
        <Container fluid={true}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              <h1>Login</h1>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {tableUserLogin()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {buttonUserLogin()}
              {buttonRefreshPage()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
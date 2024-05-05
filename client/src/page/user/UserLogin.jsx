// UserLogin.jsx

import axios from "axios";
import moment from "moment-timezone";
import InputMask from "react-input-mask";
import React, {useState, useEffect} from "react";
import {percent} from "../../assets/js/percent.js";
import {useNavigate, useLocation} from "react-router-dom";
import {LoadingNode} from "../../fragments/LoadingNode.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const navParam = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowUserLogin = async () => {
    const res = await axios.post (`${URL_OBJECT}/login`, {
      user_id: user_id,
      user_pw: user_pw,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      sessionStorage.setItem("user_id", user_id);
      sessionStorage.setItem("dataset", JSON.stringify(res.data.result.user_dataset));
      percent();
      navParam("/calendar/list");
    }
    else {
      alert(res.data.msg);
      sessionStorage.setItem("user_id", "false");
    }
  };

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <React.Fragment>
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
    </React.Fragment>
  );

  // 6. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <LoadingNode LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 11. button ----------------------------------------------------------------------------------->
  const buttonNode = () => (
    <React.Fragment>
      <Button size={"sm"} className={"primary-btn"} onClick={() => {
        flowUserLogin();
      }}>
        Log In
      </Button>
      <Button size={"sm"} className={"success-btn"} onClick={() => {
        navParam(0);
      }}>
        Refresh
      </Button>
    </React.Fragment>
  );

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"content-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container fluid={true}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"d-center"}>
                <h1>Login</h1>
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"d-center"}>
                {LOADING ? loadingNode() : tableNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"d-center"}>
                {LOADING ? "" : buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
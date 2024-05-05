// UserSignup.jsx

import axios from "axios";
import React, {useState} from "react";
import InputMask from "react-input-mask";
import {useNavigate} from "react-router-dom";
import {LoadingNode} from "../../fragments/LoadingNode.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const UserSignup = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const navParam = useNavigate();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowUserSave = async () => {
    if (user_id === "" || user_pw === "") {
      alert("Please enter both Id and Pw");
      return;
    }
    const res = await axios.post (`${URL_OBJECT}/signup`, {
      user_id: user_id,
      user_pw: user_pw,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      navParam("/user/login");
    }
    else if (res.data.status === "duplicated") {
      alert(res.data.msg);
      setUserId("");
      setUserPw("");
    }
    else if (res.data.status === "fail") {
      alert(res.data.msg);
      setUserId("");
      setUserPw("");
    }
    else {
      alert(res.data.msg);
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
          placeholder={"ID"}
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
          type={"password"}
          className={"form-control"}
          placeholder={"PW"}
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
        flowUserSave();
      }}>
        Submit
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
                <h1>Sign Up</h1>
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
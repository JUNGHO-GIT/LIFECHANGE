// UserSignup.jsx

import axios from "axios";
import React, {useState} from "react";
import InputMask from "react-input-mask";
import {useNavigate} from "react-router-dom";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const UserSignup = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CUSTOMER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const navParam = useNavigate();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowUserSave = async () => {
    if (user_id === "" || user_pw === "") {
      alert("Please enter both Id and Pw");
      return;
    }
    const response = await axios.post (`${URL_OBJECT}/signup`, {
      user_id: user_id,
      user_pw: user_pw,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      navParam("/user/login");
    }
    else if (response.data.status === "duplicated") {
      alert(response.data.msg);
      setUserId("");
      setUserPw("");
    }
    else if (response.data.status === "fail") {
      alert(response.data.msg);
      setUserId("");
      setUserPw("");
    }
    else {
      alert(response.data.msg);
    }
  };

  // 4. table ------------------------------------------------------------------------------------->
  const tableUserSave = () => {
    return (
      <div>
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
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const btnRefresh = () => {
    return (
      <React.Fragment>
        <Button type={"button"} size={"sm"} className={"success-btn"} onClick={() => {
          navParam(0);
        }}>
        Refresh
      </Button>
      </React.Fragment>
    );
  };
  const btnSignUp = () => {
    return (
      <React.Fragment>
        <Button type={"button"} size={"sm"} className={"primary-btn"} onClick={() => {
          flowUserSave();
        }}>
          Submit
        </Button>
      </React.Fragment>
    );
  };
  const btnUserList = () => {
    return (
      <React.Fragment>
        <Button type={"button"} size={"sm"} className={"secondary-btn"} onClick={() => {
          navParam("/user/list");
        }}>
          List
        </Button>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"card-wrapper"}>
          <Container fluid={true}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                <h1>Sign Up</h1>
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {tableUserSave()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {btnSignUp()}
                {btnUserList()}
                {btnRefresh()}
              </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
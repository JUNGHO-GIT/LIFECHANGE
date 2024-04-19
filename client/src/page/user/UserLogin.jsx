// UserLogin.jsx

import axios from "axios";
import React, {useState} from "react";
import InputMask from "react-input-mask";
import {useNavigate} from "react-router-dom";
import {Container, Table, FormGroup, FormCheck, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_USER;
  const navParam = useNavigate();

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
      window.sessionStorage.setItem("user_id", user_id);
      window.sessionStorage.setItem("dataset", JSON.stringify(response.data.result.user_dataset));
      navParam("/");
    }
    else {
      alert(response.data.msg);
      window.sessionStorage.setItem("user_id", "false");
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableUserLogin = () => {
    return (
      <FormGroup>
        <Form className={"input-group mb-10"}>
          <span className={"input-group-text"}>User ID</span>
          <InputMask
            mask={""}
            type={"text"}
            className={"form-control"}
            value={user_id}
            onChange={(e) => (
              setUserId(e.target.value)
            )}
          ></InputMask>
        </Form>
        <Form className={"input-group mb-10"}>
          <span className={"input-group-text"}>Password</span>
          <InputMask
            mask={""}
            type={"text"}
            className={"form-control"}
            value={user_pw}
            onChange={(e) => (
              setUserPw(e.target.value)
            )}
          ></InputMask>
        </Form>
      </FormGroup>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonUserLogin = () => {
    return (
      <React.Fragment>
        <Button variant={"primary"} size={"sm"} className={"ms-2"} onClick={flowUserLogin}>
        Log In
      </Button>
      </React.Fragment>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <React.Fragment>
        <Button variant={"success"} size={"sm"} className={"ms-2"} onClick={() => {
        navParam(0);
      }}>
        Refresh
      </Button>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <CardGroup className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row className={"d-center"}>
            <Col xs={12} className={"mb-20"}>
              <h1>Login</h1>
            </Col>
            <Col xs={12} className={"mb-20"}>
              {tableUserLogin()}
              <br/>
              {buttonUserLogin()}
              {buttonRefreshPage()}
            </Col>
            </Row>
          </Container>
        </Card>
      </CardGroup>
    </React.Fragment>
  );
};
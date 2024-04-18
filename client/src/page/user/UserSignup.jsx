// UserSignup.jsx

import axios from "axios";
import React, {useState} from "react";
import InputMask from "react-input-mask";
import {useNavigate} from "react-router-dom";
import {Container, Table, FormGroup, FormLabel, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const UserSignup = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_USER = process.env.REACT_APP_URL_USER;
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
    const response = await axios.post (`${URL_USER}/signup`, {
      user_id: user_id,
      user_pw: user_pw,
    });

    if (response.data.status === "success") {
      alert(response.data.msg);
      navParam("/user/login");
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

  // 5. table ------------------------------------------------------------------------------------->
  const tableUserSave = () => {
    return (
      <FormGroup>
        <Form className={"form-floating"}>
          <Form.Label className={"input-group-text"}>User ID</Form.Label>
          <InputMask
            mask={""}
            type={"text"}
            className={"form-control"}
            placeholder={"location_id"}
            value={user_id}
            onChange={(e) => (
              setUserId(e.target.value)
            )}
          ></InputMask>
        </Form>
        <Form className={"form-floating"}>
          <Form.Label className={"input-group-text"}>Password</Form.Label>
          <InputMask
            mask={""}
            type={"password"}
            className={"form-control"}
            placeholder={"Password"}
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
  const btnRefresh = () => {
    return (
      <React.Fragment>
        <Button type={"button"} variant={"success"} size={"sm"} className={"ms-2"} onClick={() => {
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
        <Button type={"button"} variant={"primary"} size={"sm"} className={"ms-2"} onClick={flowUserSave}>
        Submit
      </Button>
      </React.Fragment>
    );
  };
  const btnUserList = () => {
    return (
      <React.Fragment>
        <Button type={"button"} variant={"primary"} size={"sm"} className={"ms-2"} onClick={() => {
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
      <CardGroup className={"root-wrapper"}>
        <Container fluid className={"container-wrapper"}>
          <Row className={"row d-center mt-5"}>
            <Col xs={12}>
              {tableUserSave()}
              <br/>
              {btnSignUp()}
              {btnUserList()}
              {btnRefresh()}
            </Col>
          </Row>
        </Container>
      </CardGroup>
    </React.Fragment>
  );
};
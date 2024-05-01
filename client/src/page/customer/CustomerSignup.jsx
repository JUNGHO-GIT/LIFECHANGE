// CustomerSignup.jsx

import axios from "axios";
import React, {useState} from "react";
import InputMask from "react-input-mask";
import {useNavigate} from "react-router-dom";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const CustomerSignup = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CUSTOMER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const navParam = useNavigate();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [customer_id, setCustomerId] = useState("");
  const [customer_pw, setCustomerPw] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowCustomerSave = async () => {
    if (customer_id === "" || customer_pw === "") {
      alert("Please enter both Id and Pw");
      return;
    }
    const response = await axios.post (`${URL_OBJECT}/signup`, {
      customer_id: customer_id,
      customer_pw: customer_pw,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      navParam("/customer/login");
    }
    else if (response.data.status === "duplicated") {
      alert(response.data.msg);
      setCustomerId("");
      setCustomerPw("");
    }
    else if (response.data.status === "fail") {
      alert(response.data.msg);
      setCustomerId("");
      setCustomerPw("");
    }
    else {
      alert(response.data.msg);
    }
  };

  // 4. table ------------------------------------------------------------------------------------->
  const tableCustomerSave = () => {
    return (
      <div>
        <div className={"input-group"}>
          <span className={"input-group-text"}>ID</span>
          <InputMask
            mask={""}
            type={"text"}
            className={"form-control"}
            placeholder={"ID"}
            value={customer_id}
            onChange={(e) => (
              setCustomerId(e.target.value)
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
            value={customer_pw}
            onChange={(e) => (
              setCustomerPw(e.target.value)
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
          flowCustomerSave();
        }}>
          Submit
        </Button>
      </React.Fragment>
    );
  };
  const btnCustomerList = () => {
    return (
      <React.Fragment>
        <Button type={"button"} size={"sm"} className={"secondary-btn"} onClick={() => {
          navParam("/customer/list");
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
                {tableCustomerSave()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {btnSignUp()}
                {btnCustomerList()}
                {btnRefresh()}
              </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
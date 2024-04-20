// CustomerSignup.jsx

import axios from "axios";
import React, {useState} from "react";
import InputMask from "react-input-mask";
import {useNavigate} from "react-router-dom";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const CustomerSignup = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_USER;
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
    else if (response.data.status === "fail") {
      alert(response.data.msg);
      setCustomerId("");
      setCustomerPw("");
    }
    else {
      alert(response.data.msg);
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableCustomerSave = () => {
    return (
      <div>
        <div className={"form-floating"}>
          <span className={"input-group-text"}>Customer ID</span>
          <InputMask
            mask={""}
            type={"text"}
            className={"form-control"}
            placeholder={"location_id"}
            value={customer_id}
            onChange={(e) => (
              setCustomerId(e.target.value)
            )}
          ></InputMask>
        </div>
        <div className={"form-floating"}>
          <span className={"input-group-text"}>Password</span>
          <InputMask
            mask={""}
            type={"password"}
            className={"form-control"}
            placeholder={"Password"}
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
        <Button type={"button"} variant={"primary"} size={"sm"} className={"ms-2"} onClick={flowCustomerSave}>
        Submit
      </Button>
      </React.Fragment>
    );
  };
  const btnCustomerList = () => {
    return (
      <React.Fragment>
        <Button type={"button"} variant={"primary"} size={"sm"} className={"ms-2"} onClick={() => {
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
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"}>
          <Container>
            <Row className={"row d-center mt-5"}>
              <Col xs={12}>
                {tableCustomerSave()}
                <br/>
                {btnSignUp()}
                {btnCustomerList()}
                {btnRefresh()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
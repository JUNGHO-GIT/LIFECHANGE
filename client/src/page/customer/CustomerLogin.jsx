// CustomerLogin.jsx

import axios from "axios";
import moment from "moment-timezone";
import InputMask from "react-input-mask";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {percent} from "../../assets/js/percent.js";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const CustomerLogin = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CUSTOMER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [customer_id, setCustomerId] = useState("");
  const [customer_pw, setCustomerPw] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowCustomerLogin = async () => {
    const response = await axios.post (`${URL_OBJECT}/login`, {
      customer_id: customer_id,
      customer_pw: customer_pw,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      sessionStorage.setItem("customer_id", customer_id);
      sessionStorage.setItem("dataset", JSON.stringify(response.data.result.customer_dataset));
      percent();
      navParam("/diary/list");
    }
    else {
      alert(response.data.msg);
      sessionStorage.setItem("customer_id", "false");
    }
  };

  // 4. table ------------------------------------------------------------------------------------->
  const tableCustomerLogin = () => {
    return (
      <div>
        <div className={"input-group"}>
          <span className={"input-group-text"}>ID</span>
          <InputMask
            mask={""}
            type={"text"}
            className={"form-control"}
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
            type={"text"}
            className={"form-control"}
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
  const buttonCustomerLogin = () => {
    return (
      <React.Fragment>
        <Button size={"sm"} className={"primary-btn"} onClick={() => {
          flowCustomerLogin();
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

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"card-wrapper"}>
        <Container fluid={true}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              <h1>Login</h1>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {tableCustomerLogin()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {buttonCustomerLogin()}
              {buttonRefreshPage()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
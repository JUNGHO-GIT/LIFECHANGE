// CustomerLogin.jsx

import axios from "axios";
import moment from "moment-timezone";
import InputMask from "react-input-mask";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const CustomerLogin = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_USER;
  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [customer_id, setCustomerId] = useState("");
  const [customer_pw, setCustomerPw] = useState("");

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: koreanDate,
      endDt: koreanDate,
    }
  );

  // 3. flow -------------------------------------------------------------------------------------->
  const flowCustomerLogin = async () => {
    const response = await axios.post (`${URL_OBJECT}/login`, {
      customer_id: customer_id,
      customer_pw: customer_pw,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      const responseToday = await axios.get(`${URL_OBJECT}/plan/percent`, {
        params: {
          customer_id: customer_id,
          duration: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      window.sessionStorage.setItem("customer_id", customer_id);
      window.sessionStorage.setItem("dataset", JSON.stringify(response.data.result.customer_dataset));
      navParam("/");
      window.sessionStorage.setItem("percent", JSON.stringify(responseToday.data.result));
    }
    else {
      alert(response.data.msg);
      window.sessionStorage.setItem("customer_id", "false");
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableCustomerLogin = () => {
    return (
      <div>
        <div className={"input-group mb-10"}>
          <span className={"input-group-text"}>Customer ID</span>
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
        <div className={"input-group mb-10"}>
          <span className={"input-group-text"}>Password</span>
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
        <Button variant={"primary"} size={"sm"} className={"ms-2"} onClick={flowCustomerLogin}>
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
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row>
              <Col xs={12} className={"mb-20 text-center"}>
                <h1>Login</h1>
              </Col>
              <Col xs={12} className={"mb-20 text-center"}>
                {tableCustomerLogin()}
                <br/>
                {buttonCustomerLogin()}
                {buttonRefreshPage()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
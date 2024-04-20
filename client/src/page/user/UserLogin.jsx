// UserLogin.jsx

import axios from "axios";
import moment from "moment-timezone";
import InputMask from "react-input-mask";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_USER;
  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: koreanDate,
      endDt: koreanDate,
    }
  );

  // 3. flow -------------------------------------------------------------------------------------->
  const flowUserLogin = async () => {
    const response = await axios.post (`${URL_OBJECT}/login`, {
      user_id: user_id,
      user_pw: user_pw,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      const responseToday = await axios.get(`${URL_OBJECT}/plan/percent`, {
        params: {
          user_id: user_id,
          duration: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      window.sessionStorage.setItem("user_id", user_id);
      window.sessionStorage.setItem("dataset", JSON.stringify(response.data.result.user_dataset));
      navParam("/");
      window.sessionStorage.setItem("percent", JSON.stringify(responseToday.data.result));
    }
    else {
      alert(response.data.msg);
      window.sessionStorage.setItem("user_id", "false");
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableUserLogin = () => {
    return (
      <div>
        <div className={"input-group mb-10"}>
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
        </div>
        <div className={"input-group mb-10"}>
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
        </div>
      </div>
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
      <div className={"root-wrapper"}>
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
      </div>
    </React.Fragment>
  );
};
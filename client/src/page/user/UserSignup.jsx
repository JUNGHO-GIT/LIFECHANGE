// UserSignup.jsx

import axios from "axios";
import React, {useState} from "react";
import InputMask from "react-input-mask";
import {useNavigate} from "react-router-dom";
import {Button, ButtonGroup, Table, Form} from "react-bootstrap";

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
      <div>
        <div className={"form-floating"}>
          <span className={"input-group-text"}>User ID</span>
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
        </div>
        <div className={"form-floating"}>
          <span className={"input-group-text"}>Password</span>
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
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const btnRefresh = () => {
    return (
      <Button type={"button"} variant={"success"} size={"sm"} className={"ms-2"} onClick={() => {
        navParam(0);
      }}>
        Refresh
      </Button>
    );
  };
  const btnSignUp = () => {
    return (
      <Button type={"button"} variant={"primary"} size={"sm"} className={"ms-2"} onClick={flowUserSave}>
        Submit
      </Button>
    );
  };
  const btnUserList = () => {
    return (
      <Button type={"button"} variant={"primary"} size={"sm"} className={"ms-2"} onClick={() => {
        navParam("/user/list");
      }}>
        List
      </Button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center mt-5"}>
          <div className={"col-12"}>
            {tableUserSave()}
            <br/>
            {btnSignUp()}
            {btnUserList()}
            {btnRefresh()}
          </div>
        </div>
      </div>
    </div>
  );
};
// UserLogin.jsx

import axios from "axios";
import React, {useState} from "react";
import InputMask from "react-input-mask";
import {useNavigate} from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_USER = process.env.REACT_APP_URL_USER;
  const navParam = useNavigate();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowUserLogin = async () => {
    const response = await axios.post (`${URL_USER}/login`, {
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
      <button type={"button"} className={"btn btn-sm btn-primary ms-2"} onClick={flowUserLogin}>
        Log In
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type={"button"} className={"btn btn-sm btn-success ms-2"} onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>Login</h1>
          </div>
          <div className={"col-12"}>
            {tableUserLogin()}
            <br/>
            {buttonUserLogin()}
            {buttonRefreshPage()}
          </div>
        </div>
      </div>
    </div>
  );
};
// UserSignup.jsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

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
          <input type={"text"}
            className={"form-control"}
            placeholder={"location_id"}
            value={user_id}
            onChange={(e) => {setUserId(e.target.value);}}
          />
        </div>
        <div className={"form-floating"}>
          <input
            className={"form-control"}
            type={"password"}
            placeholder={"Password"}
            value={user_pw}
            id={"floatingPassword"}
            onChange={(e) => {
              setUserPw(e.target.value);
            }}
          />
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonRefreshPage = () => {
    return (
      <button type={"button"} className={"btn btn-sm btn-success ms-2"} onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };
  const buttonUserSave = () => {
    return (
      <button type={"button"} className={"btn btn-sm btn-primary ms-2"} onClick={flowUserSave}>
        Submit
      </button>
    );
  };
  const buttonUserList = () => {
    return (
      <button type={"button"} className={"btn btn-sm btn-primary ms-2"} onClick={() => {
        navParam("/user/list");
      }}>
        List
      </button>
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
            {buttonUserSave()}
            {buttonRefreshPage()}
            {buttonUserList()}
          </div>
        </div>
      </div>
    </div>
  );
};
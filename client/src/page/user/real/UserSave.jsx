// UserSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useDeveloperMode} from "../../../assets/hooks/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_USER = process.env.REACT_APP_URL_USER;
  const navParam = useNavigate();
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 2-3. useEffect ------------------------------------------------------------------------------->

  // 3. flow -------------------------------------------------------------------------------------->
  const flowUserSave = async () => {
    try {
      if (user_id === "" || user_pw === "") {
        alert("Please enter both Id and Pw");
        return;
      }

      const response = await axios.post (`${URL_USER}/save`, {
        user_id: user_id,
        user_pw: user_pw,
      });
      log("USER : " + JSON.stringify(response.data));


      if (response.data === "success") {
        alert("Signup successful");
        navParam("/user/login");
      }
      else if (response.data === "duplicate") {
        alert("This location_id already exists");
        setUserId("");
        setUserPw("");
      }
      else if (response.data === "fail") {
        alert("Incorrect Id or Pw");
        setUserId("");
        setUserPw("");
      }
      else {
        alert(`${response.data}error`);
      }
    }
    catch (e) {
      alert(`Error inserting user data: ${e.message}`);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableUserSave = () => {
    return (
      <div>
        <div className="form-floating">
          <input type={"text"}
            className={"form-control"}
            placeholder="location_id"
            value={user_id}
            onChange={(e) => {setUserId(e.target.value);}}
          />
          <label htmlFor="floatingId">location_id</label>
        </div>
        <div className="form-floating">
          <input
            className={"form-control"}
            type="password"
            placeholder="Password"
            value={user_pw}
            id="floatingPassword"
            onChange={(e) => {
              setUserPw(e.target.value);
            }}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };
  const buttonUserSave = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={flowUserSave}>
        Submit
      </button>
    );
  };
  const buttonUserList = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        navParam("/user/list");
      }}>
        List
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center mt-5">
          <div className={"col-12"}>
            <form className="form-inline">
              {tableUserSave()}
              <br/>
              {buttonUserSave()}
              {buttonRefreshPage()}
              {buttonUserList()}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
// UserInsert.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const UserInsert = () => {

  // 1. components -------------------------------------------------------------------------------->
  const TITLE = "User Insert";
  const URL_USER = process.env.REACT_APP_URL_USER;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const {log} = useDeveloperMode();
  // state
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->

  // 2-3. useEffect ------------------------------------------------------------------------------->

  // 3. flow -------------------------------------------------------------------------------------->
  const flowUserInsert = async () => {
    try {
      if (user_id === "" || user_pw === "") {
        alert("Please enter both Id and Pw");
        return;
      }

      const response = await axios.post (`${URL_USER}/userInsert`, {
        user_id: user_id,
        user_pw: user_pw,
      });
      log("USER : " + JSON.stringify(response.data));


      if (response.data === "success") {
        alert("Signup successful");
        navParam("/userLogin");
      }
      else if (response.data === "duplicate") {
        alert("This ID already exists");
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
    catch (error:any) {
      alert(`Error inserting user data: ${error.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableUserInsert = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="ID"
            value={user_id}
            onChange={(e:any) => {setUserId(e.target.value);}}
          />
          <label htmlFor="floatingId">ID</label>
        </div>
        <div className="form-floating">
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={user_pw}
            id="floatingPassword"
            onChange={(e:any) => {
              setUserPw(e.target.value);
            }}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };
  const buttonUserInsert = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={flowUserInsert}>
        Submit
      </button>
    );
  };
  const buttonUserList = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        navParam("/userList");
      }}>
        List
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container-wrapper">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <form className="form-inline">
            {tableUserInsert()}
            <br/>
            {buttonUserInsert()}
            {buttonRefreshPage()}
            {buttonUserList()}
          </form>
        </div>
      </div>
    </div>
  );
};
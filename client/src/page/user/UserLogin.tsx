// UserLogin.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

  // 1-1. title
  const TITLE = "User Login";
  // 1-2. url
  const URL_USER = process.env.REACT_APP_URL_USER;
  // 1-3. date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // 1-4. hook
  const navParam = useNavigate();
  const location = useLocation();
  // 1-5. val
  // 1-6. log
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 2-3. useEffect -------------------------------------------------------------------------------

  // 3. flow -------------------------------------------------------------------------------------->
  const flowUserLogin = async () => {
    try {
      const response = await axios.post (`${URL_USER}/userLogin`, {
        user_id: user_id,
        user_pw: user_pw,
      });
      log("USER : " + JSON.stringify(response.data));

      if (response.data === "success") {
        alert("Login successful");
        window.sessionStorage.setItem("user_id", user_id);
        navParam("/");
      }
      else {
        alert("Incorrect ID or PW");
        window.sessionStorage.setItem("user_id", "false");
      }
    }
    catch (error:any) {
      alert(`Error fetching user data: ${error.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableUserLogin = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="ID" value={user_id}
          onChange={(e:any) => {setUserId(e.target.value);}} />
          <label htmlFor="floatingId">ID</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Password" value={user_pw}
          onChange={(e:any) => {setUserPw(e.target.value);}} />
          <label htmlFor="floatingPassword">Password</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonUserLogin = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={flowUserLogin}>
        Log In
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5 mb-20">
        <div className="col-10">
          <form className="form-inline">
            {tableUserLogin()}
            <br/>
            {buttonUserLogin()}
            {buttonRefreshPage()}
          </form>
        </div>
      </div>
    </div>
  );
};
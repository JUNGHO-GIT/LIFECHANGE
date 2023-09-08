// UserLogin.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

  // title
  const TITLE = "User Login";
  // url
  const URL_USER = process.env.REACT_APP_URL_USER;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  // state
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // ---------------------------------------------------------------------------------------------->
  const userLoginFlow = async () => {
    try {
      const response = await axios.post (`${URL_USER}/userLogin`, {
        user_id: user_id,
        user_pw: user_pw,
      });
      if (response.data === "success") {
        alert("Login successful");
        window.sessionStorage.setItem("user_id", user_id);
        window.location.href = "/";
      }
      else if (response.data === "fail") {
        alert("Incorrect ID or PW");
        window.sessionStorage.setItem("user_id", "false");
      }
      else {
        alert(`${response.data}error`);
      }
    }
    catch (error: any) {
      alert(`Error fetching user data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const userLoginTable = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="ID" value={user_id}
          onChange={(e) => {setUserId(e.target.value);}} />
          <label htmlFor="floatingId">ID</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Password" value={user_pw}
          onChange={(e) => {setUserPw(e.target.value);}} />
          <label htmlFor="floatingPassword">Password</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonUserLogin = () => {
    return (
      <button type="button" className="btn btn-primary ms-2" onClick={userLoginFlow}>
        Log In
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {userLoginTable()}
            <br/>
            {buttonUserLogin()}
          </form>
        </div>
      </div>
    </div>
  );
};
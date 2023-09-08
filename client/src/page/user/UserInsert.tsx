// UserInsert.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const UserInsert = () => {

  // title
  const TITLE = "User Insert";
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
  const userInsertFlow = async () => {
    try {
      if (user_id === "" || user_pw === "") {
        alert("Please enter both Id and Pw");
        return;
      }
      const response = await axios.post (`${URL_USER}/userInsert`, {
        user_id: user_id,
        user_pw: user_pw,
      });
      if (response.data === "success") {
        alert("Signup successful");
        window.location.href = "/userLogin";
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
    catch (error: any) {
      alert(`Error fetching user data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const userInsertTable = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="ID"
            value={user_id}
            onChange={(e) => {setUserId(e.target.value);}}
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
            onChange={(e) => {
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
      <Link to="/userInsert">
        <button type="button" className="btn btn-success ms-2">Refresh</button>
      </Link>
    );
  };
  const buttonUserInsert = () => {
    return (
      <button type="button" className="btn btn-primary ms-2" onClick={userInsertFlow}>
        Submit
      </button>
    );
  };
  const buttonUserList = () => {
    return (
      <Link to="/userList">
        <button type="button" className="btn btn-secondary ms-2">List</button>
      </Link>
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
            {userInsertTable()}
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
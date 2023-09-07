// UserUpdate.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const UserUpdate = () => {

  // title
  const TITLE = "User Update";
  // url
  const URL_USER = process.env.REACT_APP_URL_USER;
  // date
  const koreanDate = moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  // state
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchUserUpdate = async () => {
      const user_id = window.sessionStorage.getItem("user_id");

      try {
        const response = await axios.post (`${URL_USER}/userDetail`, {
          user_id: user_id,
        });
        setUserId(response.data.user_id);
      }
      catch (error : any) {
        alert(`Error fetching user data: ${error.message}`);
      }
    };
    fetchUserUpdate();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const userUpdateFlow = async () => {
    try {
      if (user_pw === "" || user_pw === null) {
        alert("Please enter your password");
        return;
      }
      else {
        const response = await axios.post (`${URL_USER}/userCheckIdPw`, {
          user_id: user_id,
          user_pw: user_pw,
        });
        if (response.data === "fail") {
          alert("Incorrect password");
          return;
        }
        else if (response.data === "success") {
          const updatePw = prompt("Please enter a new password");
          const response = await axios.put(`${URL_USER}/userUpdate`, {
            user_id: user_id,
            user_pw: updatePw
          });
          if (response.data === "success") {
            alert("User Update success");
            window.location.href = "/";
          }
          else if (response.data === "fail") {
            alert("User Update fail");
          }
          else {
            alert("Error Ocurred in User Delete");
          }
        }
      }
    }
    catch (error : any) {
      alert(`Error fetching user data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const userUpdateTable = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="user_id"
            placeholder="User ID"
            value={user_id}
            onChange={(e) => setUserId(e.target.value)}
            readOnly
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="user_pw"
            placeholder="User PW"
            value={user_pw}
            onChange={(e) => setUserPw(e.target.value)}
          />
          <label htmlFor="user_pw">User PW</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonUserUpdate = () => {
    return (
      <button type="button" className="btn btn-primary ms-2" onClick={userUpdateFlow}>
        User Update
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
            {userUpdateTable()}
            <br/>
            {buttonUserUpdate()}
          </form>
        </div>
      </div>
    </div>
  );
};
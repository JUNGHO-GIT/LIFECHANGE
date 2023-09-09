// UserDetail.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const UserDetail = () => {

  // title
  const TITLE = "User Detail";
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

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchUserDetail = async () => {
      const user_id = window.sessionStorage.getItem("user_id");

      try {
        const response = await axios.post (`${URL_USER}/userDetail`, {
          user_id: user_id,
        });
        if (response.status === 200) {
          const {user_id, user_pw} = response.data;
          setUserId(user_id);
          setUserPw(user_pw);
        }
        else {
          throw new Error("Server responded with an error");
        }
      }
      catch (error: any) {
        alert(`Error fetching user data: ${error.message}`);
      }
    };
    fetchUserDetail();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const userDetailTable = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="User ID"
            value={user_id}
            onChange={(e) => {setUserId(e.target.value);}}
            readOnly
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="User PW"
            value={user_pw}
            onChange={(e) => {setUserPw(e.target.value);}}
            readOnly
          />
          <label htmlFor="user_pw">User PW</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonRefreshPage = () => {
    return (
      <Link to="/userDetail">
        <button type="button" className="btn btn-success ms-2">Refresh</button>
      </Link>
    );
  };
  const buttonUserUpdate = () => {
    return (
      <Link to="/userUpdate">
        <button type="button" className="btn btn-primary ms-2">Update</button>
      </Link>
    );
  };
  const buttonUserDelete = () => {
    return (
      <Link to="/userDelete">
        <button type="button" className="btn btn-danger ms-2">Delete</button>
      </Link>
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
            {userDetailTable()}
            <br/>
            {buttonRefreshPage()}
            {buttonUserUpdate()}
            {buttonUserDelete()}
            {buttonUserList()}
          </form>
        </div>
      </div>
    </div>
  );
};
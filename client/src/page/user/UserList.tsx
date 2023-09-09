// UserList.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const UserList = () => {

  // title
  const TITLE = "User List";
  // url
  const URL_USER = process.env.REACT_APP_URL_USER;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const [USER_LIST, setUSER_LIST] = useState<[]>([]);

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axios.get (`${URL_USER}/userList`);
        setUSER_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching user data: ${error.message}`);
        setUSER_LIST([]);
      }
    };
    fetchUserList();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const userListTable = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>User ID</th>
            <th>User PW</th>
          </tr>
        </thead>
        <tbody>
          {USER_LIST.map((key:any) => (
            <tr>
              <td>{key.user_id}</td>
              <td>{key.user_pw}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonRefreshPage = () => {
    return (
      <Link to="/userList">
        <button type="button" className="btn btn-success ms-2">Refresh</button>
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
            {userListTable()}
            <br/>
            {buttonRefreshPage()}
          </form>
        </div>
      </div>
    </div>
  );
};
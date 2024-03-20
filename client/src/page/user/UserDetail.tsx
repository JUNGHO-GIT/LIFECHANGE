// UserDetail.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const UserDetail = () => {

  // 1. components -------------------------------------------------------------------------------->
  const TITLE = "User Detail";
  const URL_USER = process.env.REACT_APP_URL_USER;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 2-3. useEffect ------------------------------------------------------------------------------->
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
          log("USER : " + JSON.stringify(response.data));
        }
        else {
          throw new Error("Server responded with an error");
        }
      }
      catch (error:any) {
        alert(`Error fetching user data: ${error.message}`);
      }
    };
    fetchUserDetail();
  }, []);

  // 3. flow -------------------------------------------------------------------------------------->

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableUserDetail = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="User ID"
            value={user_id}
            onChange={(e:any) => {setUserId(e.target.value);}}
            readOnly
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="User PW"
            value={user_pw}
            onChange={(e:any) => {setUserPw(e.target.value);}}
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
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };
  const buttonUserUpdate = () => {
    return (
      <button type="button" className="btn btn-sm btn-warning ms-2" onClick={() => {
        navParam("/userUpdate");
      }}>
        Update
      </button>
    );
  };
  const buttonUserDelete = () => {
    return (
      <button type="button" className="btn btn-sm btn-danger ms-2" onClick={() => {
        navParam("/userDelete");
      }}>
        Delete
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
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {tableUserDetail()}
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
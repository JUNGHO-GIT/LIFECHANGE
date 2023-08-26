// UserInfo.tsx
import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
const UserInfo = () => {
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  const fetchUserInfo = async () => {
    const user_id = window.sessionStorage.getItem("user_id");

    try {
      const res = await axios.post("http://127.0.0.1:4000/user/userDetail", {
        user_id: user_id,
      });

      if (res.status === 200) {
        const {user_id, user_pw} = res.data;
        setUserId(user_id);
        setUserPw(user_pw);
      }
      else {
        throw new Error("Server responded with an error");
      }
    }
    catch (error: any) {
      if (error instanceof Error) {
        alert(`Error fetching user data: ${error.message}`);
      }
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const buttonRefreshPage = () => {
    return (
      <Link to="/userInfo">
        <button type="button" className="btn btn-success">Refresh</button>
      </Link>
    );
  };

  const buttonUserUpdate = () => {
    return (
      <Link to="/userUpdate">
        <button type="button" className="btn btn-primary">Update</button>
      </Link>
    );
  };

  const buttonUserDelete = () => {
    return (
      <Link to="/userDelete">
        <button type="button" className="btn btn-danger">Delete</button>
      </Link>
    );
  };

  const buttonUserList = () => {
    return (
      <Link to="/userList">
        <button type="button" className="btn btn-secondary">List</button>
      </Link>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const UserInfoTable = () => {
    return (
      <>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="User ID"
          value={user_id} onChange={(e) => setUserId(e.target.value)} readOnly />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="User PW"
          value={user_pw} onChange={(e) => setUserPw(e.target.value)} readOnly />
          <label htmlFor="user_pw">User PW</label>
        </div>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h1 className="mb-3 fw-9">User Info</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <form className="form-inline">
            {UserInfoTable()}
            <div className="empty-h50"></div>
            {buttonRefreshPage()}
            &nbsp;
            {buttonUserUpdate()}
            &nbsp;
            {buttonUserDelete()}
            &nbsp;
            {buttonUserList()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
import React, {useState, useEffect} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const UserInfoStyle = createGlobalStyle`
  .userDetail {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-userDetail {
    max-width: 330px;
    padding: 15px;
  }

  .form-userDetail .form-floating:focus-within {
    z-index: 2;
  }

  .form-userDetail input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-userDetail input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

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
    catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error fetching user data: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const refreshUserInfo = () => {
    window.location.reload();
  };

  const buttonUserUpdate = () => {
    window.location.href = "/userUpdate";
  };

  const buttonUserDelete = () => {
    window.location.href = "/userDelete";
  };

  const buttonUserList = () => {
    window.location.href = "/userList";
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <>
      <UserInfoStyle />
      <section className="userDetail custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">User Info</h1>
          <div className="empty-h20"></div>
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
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input type="text"
              className="form-control"
              id="user_pw"
              placeholder="User PW"
              value={user_pw}
              onChange={(e) => setUserPw(e.target.value)}
              readOnly
            />
            <label htmlFor="user_pw">User PW</label>
          </div>
          <div className="empty-h100"></div>
          <button type="button" className="btn btn-success" onClick={refreshUserInfo}>
            Refresh
          </button>
          &nbsp;
          <button type="button" className="btn btn-primary" onClick={buttonUserUpdate}>
            Update
          </button>
          &nbsp;
          <button type="button" className="btn btn-danger" onClick={buttonUserDelete}>
            Delete
          </button>
          &nbsp;
          <button type="button" className="btn btn-secondary" onClick={buttonUserList}>
            List
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </>
  );
};

export default UserInfo;

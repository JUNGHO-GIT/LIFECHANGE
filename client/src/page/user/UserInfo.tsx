import React, {useState, useEffect} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const UserInfoStyle = createGlobalStyle`
  .userInfo {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-userInfo {
    max-width: 330px;
    padding: 15px;
  }

  .form-userInfo .form-floating:focus-within {
    z-index: 2;
  }

  .form-userInfo input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-userInfo input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

// ------------------------------------------------------------------------------------------------>
const UserInfo = () => {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  const fetchUserInfo = async () => {
    const userId = window.sessionStorage.getItem("userId");

    try {
      const res = await axios.post("http://127.0.0.1:4000/user/userInfo", {
        userId: userId,
      });

      if (res.status === 200) {
        const {userId, userPw} = res.data;
        setUserId(userId);
        setUserPw(userPw);
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

  // ---------------------------------------------------------------------------------------------->
  return (
    <div>
      <UserInfoStyle />
      <section className="userInfo custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">User Info</h1>
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input type="text"
              className="form-control"
              id="userId"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              readOnly
            />
            <label htmlFor="userId">User ID</label>
          </div>
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input type="text"
              className="form-control"
              id="userPw"
              placeholder="User PW"
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
              readOnly
            />
            <label htmlFor="userPw">User PW</label>
          </div>
          <div className="empty-h100"></div>
          <button type="button" className="btn btn-primary" onClick={refreshUserInfo}>
            Refresh User Info
          </button>
          &nbsp;
          <button type="button" className="btn btn-primary" onClick={buttonUserUpdate}>
            Go to User Update
          </button>
          &nbsp;
          <button type="button" className="btn btn-primary" onClick={buttonUserDelete}>
            Go to User Delete
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </div>
  );
};

export default UserInfo;

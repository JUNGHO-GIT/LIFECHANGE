import React, {useState, useEffect} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const UserUpdateStyle = createGlobalStyle`
  .userUpdate {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-userUpdate {
    max-width: 330px;
    padding: 15px;
  }

  .form-userUpdate .form-floating:focus-within {
    z-index: 2;
  }

  .form-userUpdate input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-userUpdate input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

// ------------------------------------------------------------------------------------------------>
const UserUpdate = () => {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  const fetchUserUpdate = async () => {
    const userId = window.sessionStorage.getItem("userId");

    try {
      const res = await axios.post("http://localhost:4000/user/userInfo", {
        userId: userId,
      });
      setUserId(res.data.userId);
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error fetching user data: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchUserUpdate();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const buttonUserUpdate = async () => {

    if (userPw === "" || userPw === null) {
      alert("Please enter your password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/user/checkIdPw", {
        userId: userId,
        userPw: userPw,
      });

      if (res.data === "fail") {
        alert("Incorrect password");
        return;
      }

      if (res.data === "success") {

        const updatePw = prompt("Please enter a new password");

        try {
          const res = await axios.put("http://localhost:4000/user/userUpdate", {
            userId: userId,
            userPw: updatePw
          });

          if (res.data === "success") {
            alert("User Update success");
            window.location.href = "/";
          }
          else if (res.data === "fail") {
            alert("User Update fail");
          }
          else {
            alert("Error Ocurred in User Delete");
          }
        }
        catch (error: unknown) {
          if (error instanceof Error) {
            alert(`Error fetching user data: ${error.message}`);
          }
        }
      }
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error fetching user data: ${error.message}`);
      }
    }
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div>
      <UserUpdateStyle />
      <section className="userUpdate custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">User Update</h1>
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
            />
            <label htmlFor="userPw">User PW</label>
          </div>
          <div className="empty-h100"></div>
          <button type="button" className="btn btn-primary" onClick={buttonUserUpdate}>
            User Update
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </div>
  );
};

export default UserUpdate;

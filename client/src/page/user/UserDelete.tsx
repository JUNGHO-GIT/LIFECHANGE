import React, {useState, useEffect} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const UserDeleteStyle = createGlobalStyle`
  .userDelete {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-userDelete {
    max-width: 330px;
    padding: 15px;
  }

  .form-userDelete .form-floating:focus-within {
    z-index: 2;
  }

  .form-userDelete input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-userDelete input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

// ------------------------------------------------------------------------------------------------>
const UserDelete = () => {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  const fetchUserDelete = async () => {
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
    fetchUserDelete();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const buttonUserDelete = async () => {

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

        try {
          const res = await axios.delete("http://localhost:4000/user/userDelete", {
            data: {
              userId: userId,
            },
          });

          if (res.data === "success") {
            alert("User Delete Success");
            window.sessionStorage.clear();
            window.location.href = "/";
          }
          else if (res.data === "fail") {
            alert("User Delete Fail");
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
      <UserDeleteStyle />
      <section className="userDelete custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">User Delete</h1>
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
          <button type="button" className="btn btn-primary" onClick={buttonUserDelete}>
            User Delete
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </div>
  );
};

export default UserDelete;
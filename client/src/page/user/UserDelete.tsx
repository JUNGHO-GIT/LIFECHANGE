// UserDelete.tsx
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
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  const fetchUserDelete = async () => {
    const user_id = window.sessionStorage.getItem("user_id");

    try {
      const res = await axios.post("http://127.0.0.1:4000/user/userDetail", {
        user_id: user_id,
      });
      setUserId(res.data.user_id);
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

    if (user_pw === "" || user_pw === null) {
      alert("Please enter your password");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:4000/user/userCheckIdPw", {
        user_id: user_id,
        user_pw: user_pw,
      });

      if (res.data === "fail") {
        alert("Incorrect password");
        return;
      }

      if (res.data === "success") {

        try {
          const res = await axios.delete("http://127.0.0.1:4000/user/userDelete", {
            data: {
              user_id: user_id,
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
    <section className="userDelete custom-flex-center"><UserDeleteStyle />
      <form>
        <div className="empty-h50"></div>
        <h1 className="mb-3">User Delete</h1>
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
          />
          <label htmlFor="user_pw">User PW</label>
        </div>
        <div className="empty-h100"></div>
        <button type="button" className="btn btn-primary" onClick={buttonUserDelete}>
          User Delete
        </button>
        <div className="empty-h50"></div>
      </form>
    </section>
  );
};

export default UserDelete;
import React, {useState} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

const LoginStyle = createGlobalStyle`
  .login {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-login {
    max-width: 330px;
    padding: 15px;
  }

  .form-login .form-floating:focus-within {
    z-index: 2;
  }

  .form-login input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-login input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

// ------------------------------------------------------------------------------------------------>
const Login = () => {
  const [userId, setId] = useState("");
  const [userPw, setPassword] = useState("");

  const LoginFlow = async () => {
    const res = await axios.post("http://127.0.0.1:4000/user/login", {
      userId: userId,
      userPw: userPw,
    });

    if (userId.length === 0 || userPw.length === 0) {
      alert("Please enter both ID and PW");
      return;
    }
    else if (res.data === "success") {
      alert("Login successful");
      window.sessionStorage.setItem("userId", userId);
      window.location.href = "/";
    }
    else if (res.data === "fail") {
      alert("Incorrect ID or PW");
      window.sessionStorage.setItem("userId", "false");
    }
    else {
      alert(`${res.data}error`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <>
      <LoginStyle />
      <section className="login custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">Log In</h1>
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input
              className="form-control"
              type="text"
              placeholder="ID"
              value={userId}
              id="floatingId"
              onChange={(e) => {
                setId(e.target.value);
              }}
            />
            <label htmlFor="floatingId">ID</label>
          </div>
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input
              className="form-control"
              type="text"
              placeholder="Password"
              value={userPw}
              id="floatingPassword"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="empty-h100"></div>
          <button className="w-100 btn btn-lg btn-primary" type="button" onClick={LoginFlow}>
            Log In
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </>
  );
};

export default Login;

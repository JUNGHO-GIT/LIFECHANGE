import React, {useState} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

const SignupStyle = createGlobalStyle`
  .signup {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-Signup {
    max-width: 330px;
    padding: 15px;
  }

  .form-Signup .form-floating:focus-within {
    z-index: 2;
  }

  .form-Signup input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-Signup input[type="userPw"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

// ------------------------------------------------------------------------------------------------>
const Signup = () => {
  const [userId, setId] = useState("");
  const [userPw, setPassword] = useState("");

  const SignupFlow = async () => {
    if (userId === "" || userPw === "") {
      alert("Please enter both Id and Pw");
      return;
    }

    const res = await axios.post("http://localhost:4000/user/signup", {
      userId: userId,
      userPw: userPw,
    });

    if (res.data === "success") {
      alert("Signup successful");
      window.location.href = "/login";
    }
    else if (res.data === "duplicate") {
      alert("This ID already exists");
      setId("");
      setPassword("");
    }
    else if (res.data === "fail") {
      alert("Incorrect Id or Pw");
      setId("");
      setPassword("");
    }
    else {
      alert(`${res.data}error`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div>
      <SignupStyle />
      <section className="signup custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">Sign up</h1>
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
              type="password"
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
          <button className="w-100 btn btn-lg btn-primary" type="button" onClick={SignupFlow}>
            Submit
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </div>
  );
};

export default Signup;

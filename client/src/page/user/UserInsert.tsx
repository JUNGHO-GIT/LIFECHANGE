// UserInsert.tsx
import React, {useState} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

const SignupStyle = createGlobalStyle`
  .userInsert {
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

  .form-Signup input[type="user_pw"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

// ------------------------------------------------------------------------------------------------>
const Signup = () => {
  const [user_id, setId] = useState("");
  const [user_pw, setPassword] = useState("");

  const SignupFlow = async () => {
    if (user_id === "" || user_pw === "") {
      alert("Please enter both Id and Pw");
      return;
    }

    const res = await axios.post("http://127.0.0.1:4000/user/userInsert", {
      user_id: user_id,
      user_pw: user_pw,
    });

    if (res.data === "success") {
      alert("Signup successful");
      window.location.href = "/userLogin";
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
    <section className="userInsert custom-flex-center"><SignupStyle />
      <form>
        <div className="empty-h50"></div>
        <h1 className="mb-3">Sign up</h1>
        <div className="empty-h20"></div>
        <div className="form-floating">
          <input
            className="form-control"
            type="text"
            placeholder="ID"
            value={user_id}
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
            value={user_pw}
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
  );
};

export default Signup;

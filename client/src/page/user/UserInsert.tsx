// UserInsert.tsx
import React, {useState} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const UserInsert = () => {
  const [user_id, setId] = useState("");
  const [user_pw, setPassword] = useState("");

  // ---------------------------------------------------------------------------------------------->
  const UserInsertFlow = async () => {
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
  const buttonUserInsert = () => {
    return (
      <button type="button" className="btn btn-primary" onClick={UserInsertFlow}>
        Submit
      </button>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const UserInsertTable = () => {
    return (
      <>
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
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h1 className="mb-3 fw-9">User Insert</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <form className="form-inline">
            {UserInsertTable()}
            <div className="empty-h50"></div>
            {buttonUserInsert()}
            <div className="empty-h50"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInsert;
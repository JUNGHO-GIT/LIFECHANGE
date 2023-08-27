// UserInsert.tsx
import React, {useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
export const UserInsert = () => {

  const [user_id, setId] = useState("");
  const [user_pw, setPassword] = useState("");
  const URL = "http://127.0.0.1:4000/user";
  const TITLE = "User Insert";

  // ---------------------------------------------------------------------------------------------->
  const userInsertFlow = async () => {
    try {
      if (user_id === "" || user_pw === "") {
        alert("Please enter both Id and Pw");
        return;
      }
      const response = await axios.post (`${URL}/userInsert`, {
        user_id: user_id,
        user_pw: user_pw,
      });
      if (response.data === "success") {
        alert("Signup successful");
        window.location.href = "/userLogin";
      }
      else if (response.data === "duplicate") {
        alert("This ID already exists");
        setId("");
        setPassword("");
      }
      else if (response.data === "fail") {
        alert("Incorrect Id or Pw");
        setId("");
        setPassword("");
      }
      else {
        alert(`${response.data}error`);
      }
    }
    catch (error: any) {
      alert(`Error fetching user data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const userInsertTable = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="ID"
            value={user_id}
            onChange={(e) => {setId(e.target.value);}}
          />
          <label htmlFor="floatingId">ID</label>
        </div>
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
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonRefreshPage = () => {
    return (
      <Link to="/userInsert">
        <button type="button" className="btn btn-success ms-2">Refresh</button>
      </Link>
    );
  };
  const buttonUserInsert = () => {
    return (
      <button type="button" className="btn btn-primary ms-2" onClick={userInsertFlow}>
        Submit
      </button>
    );
  };
  const buttonUserList = () => {
    return (
      <Link to="/userList">
        <button type="button" className="btn btn-secondary ms-2">List</button>
      </Link>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {userInsertTable()}
            <br/>
            {buttonUserInsert()}
            {buttonRefreshPage()}
            {buttonUserList()}
          </form>
        </div>
      </div>
    </div>
  );
};
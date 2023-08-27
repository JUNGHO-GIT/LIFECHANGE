// UserInsert.tsx
import React, {useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
const UserInsert = () => {

  const [user_id, setId] = useState("");
  const [user_pw, setPassword] = useState("");
  const URL = "http://127.0.0.1:4000/user";
  const TITLE = "User Info";

  // ---------------------------------------------------------------------------------------------->
  const userInsertFlow = async () => {
    try {
      if (user_id === "" || user_pw === "") {
        alert("Please enter both Id and Pw");
        return;
      }
      const res = await axios.post (`${URL}/userInsert`, {
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
    }
    catch (error: any) {
      alert(`Error fetching user data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const userInsertTable = () => {
    return (
      <>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="ID"
            value={user_id}
            onChange={(e) => {setId(e.target.value);}}
          />
          <label htmlFor="floatingId">ID</label>
        </div>
        <div className="he-20"></div>
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
  const buttonRefreshPage = () => {
    return (
      <Link to="/userInsert">
        <button type="button" className="btn btn-success">Refresh</button>
      </Link>
    );
  };

  const buttonUserInsert = () => {
    return (
      <button type="button" className="btn btn-primary" onClick={userInsertFlow}>
        Submit
      </button>
    );
  };

  const buttonUserList = () => {
    return (
      <Link to="/userList">
        <button type="button" className="btn btn-secondary">List</button>
      </Link>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="he-50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="he-50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <form className="form-inline">
            {userInsertTable()}
            <div className="he-50"></div>
            {buttonUserInsert()}
            &nbsp;
            {buttonRefreshPage()}
            &nbsp;
            {buttonUserList()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInsert;
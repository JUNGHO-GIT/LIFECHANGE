// UserLogin.tsx
import React, {useState} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const UserLogin = () => {
  const [user_id, setId] = useState("");
  const [user_pw, setPassword] = useState("");
  const URL = "http://127.0.0.1:4000/user";
  const TITLE = "User Login";

  // ---------------------------------------------------------------------------------------------->
  const userLoginFlow = async () => {
    try {
      const res = await axios.post (`${URL}/userLogin`, {
        user_id: user_id,
        user_pw: user_pw,
      });
      if (res.data === "success") {
        alert("Login successful");
        window.sessionStorage.setItem("user_id", user_id);
        window.location.href = "/";
      }
      else if (res.data === "fail") {
        alert("Incorrect ID or PW");
        window.sessionStorage.setItem("user_id", "false");
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
  const userLoginTable = () => {
    return (
      <>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="ID" value={user_id}
          onChange={(e) => {setId(e.target.value);}} />
          <label htmlFor="floatingId">ID</label>
        </div>
        <div className="he-20"></div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Password" value={user_pw}
          onChange={(e) => {setPassword(e.target.value);}} />
          <label htmlFor="floatingPassword">Password</label>
        </div>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonUserLogin = () => {
    return (
      <button type="button" className="btn btn-primary" onClick={userLoginFlow}>
        Log In
      </button>
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
            {userLoginTable()}
            <div className="he-50"></div>
            {buttonUserLogin()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
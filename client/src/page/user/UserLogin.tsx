// UserLogin.tsx
import React, {useState} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

  const [user_id, setId] = useState("");
  const [user_pw, setPassword] = useState("");
  const URL_USER = process.env.REACT_APP_URL_USER;
  const TITLE = "User Login";

  // ---------------------------------------------------------------------------------------------->
  const userLoginFlow = async () => {
    try {
      const response = await axios.post (`${URL_USER}/userLogin`, {
        user_id: user_id,
        user_pw: user_pw,
      });
      if (response.data === "success") {
        alert("Login successful");
        window.sessionStorage.setItem("user_id", user_id);
        window.location.href = "/";
      }
      else if (response.data === "fail") {
        alert("Incorrect ID or PW");
        window.sessionStorage.setItem("user_id", "false");
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
  const userLoginTable = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="ID" value={user_id}
          onChange={(e) => {setId(e.target.value);}} />
          <label htmlFor="floatingId">ID</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Password" value={user_pw}
          onChange={(e) => {setPassword(e.target.value);}} />
          <label htmlFor="floatingPassword">Password</label>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonUserLogin = () => {
    return (
      <button type="button" className="btn btn-primary ms-2" onClick={userLoginFlow}>
        Log In
      </button>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {userLoginTable()}
            <br/>
            {buttonUserLogin()}
          </form>
        </div>
      </div>
    </div>
  );
};
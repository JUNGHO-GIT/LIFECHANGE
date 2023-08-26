// UserLogin.tsx
import React, {useState} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const UserLogin = () => {
  const [user_id, setId] = useState("");
  const [user_pw, setPassword] = useState("");

  const UserLoginFlow = async () => {
    const res = await axios.post("http://127.0.0.1:4000/user/userLogin", {
      user_id: user_id,
      user_pw: user_pw,
    });

    if (user_id.length === 0 || user_pw.length === 0) {
      alert("Please enter both ID and PW");
      return;
    }
    else if (res.data === "success") {
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
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonUserLogin = () => {
    return (
      <button type="button" className="btn btn-primary" onClick={UserLoginFlow}>
        Log In
      </button>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const UserLoginTable = () => {
    return (
      <>
      <div className="form-floating">
        <input type="text" className="form-control" placeholder="ID" value={user_id}
        onChange={(e) => {setId(e.target.value);}} />
        <label htmlFor="floatingId">ID</label>
      </div>
      <div className="empty-h20"></div>
      <div className="form-floating">
        <input type="text" className="form-control" placeholder="Password" value={user_pw}
        onChange={(e) => {setPassword(e.target.value);}} />
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
          <h1 className="mb-3 fw-9">User Login</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <form className="form-inline">
            {UserLoginTable()}
            <div className="empty-h50"></div>
            {buttonUserLogin()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
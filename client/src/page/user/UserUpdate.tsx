// UserUpdate.tsx
import React, {useState, useEffect} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const UserUpdate = () => {

  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");
  const URL = "http://127.0.0.1:4000/user";
  const TITLE = "User Update";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchUserUpdate = async () => {
      const user_id = window.sessionStorage.getItem("user_id");

      try {
        const res = await axios.post (`${URL}/userDetail`, {
          user_id: user_id,
        });
        setUserId(res.data.user_id);
      }
      catch (error : any) {
        alert(`Error fetching user data: ${error.message}`);
      }
    };
    fetchUserUpdate();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const userUpdateFlow = async () => {
    try {
      if (user_pw === "" || user_pw === null) {
        alert("Please enter your password");
        return;
      }
      else {
        const res = await axios.post (`${URL}/userCheckIdPw`, {
          user_id: user_id,
          user_pw: user_pw,
        });
        if (res.data === "fail") {
          alert("Incorrect password");
          return;
        }
        if (res.data === "success") {
          const updatePw = prompt("Please enter a new password");
          const res = await axios.put(`${URL}/userUpdate`, {
            user_id: user_id,
            user_pw: updatePw
          });
          if (res.data === "success") {
            alert("User Update success");
            window.location.href = "/";
          }
          else if (res.data === "fail") {
            alert("User Update fail");
          }
          else {
            alert("Error Ocurred in User Delete");
          }
        }
      }
    }
    catch (error : any) {
      alert(`Error fetching user data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const userUpdateTable = () => {
    return (
      <>
        <div className="he-20"></div>
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
          <div className="he-20"></div>
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
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonUserUpdate = () => {
    return (
      <button className="btn btn-primary" type="button" onClick={userUpdateFlow}>
        User Update
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
            {userUpdateTable()}
            <div className="he-50"></div>
            {buttonUserUpdate()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserUpdate;
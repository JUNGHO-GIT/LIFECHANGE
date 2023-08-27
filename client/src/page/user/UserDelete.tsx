// UserDelete.tsx
import React, {useState, useEffect} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const UserDelete = () => {

  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");
  const URL = "http://127.0.0.1:4000/user";
  const TITLE = "User Delete";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchUserDelete = async () => {
      const user_id = window.sessionStorage.getItem("user_id");

      try {
        const res = await axios.post (`${URL}/userDetail`, {
          user_id: user_id,
        });
        setUserId(res.data.user_id);
      }
      catch (error: any) {
        alert(`Error fetching user data: ${error.message}`);
      }
    };
    fetchUserDelete();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const userDeleteFlow = async () => {
    try {
      if (user_pw === "" || user_pw === null) {
        alert("Please enter your password");
        return;
      }
      else {
        const res = await axios.post(`${URL}/userCheckIdPw`, {
          user_id: user_id,
          user_pw: user_pw,
        });
        if (res.data === "fail") {
          alert("Incorrect password");
          return;
        }
        if (res.data === "success") {
          const res = await axios.delete (`${URL}/userDelete`, {
            data: {
              user_id: user_id,
            },
          });
          if (res.data === "success") {
            alert("User Delete Success");
            window.sessionStorage.clear();
            window.location.href = "/";
          }
          else if (res.data === "fail") {
            alert("User Delete Fail");
          }
          else {
            alert("Error Ocurred in User Delete");
          }
        }
      }
    }
    catch (error: any) {
      alert(`Error fetching user data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const userDeleteTable = () => {
    return (
      <>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="User ID"
            value={user_id}
            onChange={(e) => setUserId(e.target.value)}
            readOnly
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="empty-h20"></div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
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
  const buttonUserDelete = () => {
    return (
      <button className="btn btn-primary" type="button" onClick={userDeleteFlow}>
        User Delete
      </button>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <form className="form-inline">
            {userDeleteTable()}
            <div className="empty-h20"></div>
            {buttonUserDelete()}
          </form>
        </div>
      </div>
      <div className="empty-h200"></div>
    </div>
  );
};

export default UserDelete;
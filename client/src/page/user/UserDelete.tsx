// UserDelete.tsx
import React, {useState, useEffect} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const UserDelete = () => {

  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");
  const URL_USER = process.env.REACT_APP_URL_USER;
  const TITLE = "User Delete";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchUserDelete = async () => {
      const user_id = window.sessionStorage.getItem("user_id");

      try {
        const response = await axios.post (`${URL_USER}/userDetail`, {
          user_id: user_id,
        });
        setUserId(response.data.user_id);
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
        const response = await axios.post(`${URL}/userCheckIdPw`, {
          user_id: user_id,
          user_pw: user_pw,
        });
        if (response.data === "fail") {
          alert("Incorrect password");
          return;
        }
        if (response.data === "success") {
          const response = await axios.delete (`${URL}/userDelete`, {
            data: {
              user_id: user_id,
            },
          });
          if (response.data === "success") {
            alert("User Delete Success");
            window.sessionStorage.clear();
            window.location.href = "/";
          }
          else if (response.data === "fail") {
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
      <div>
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
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="User PW"
            value={user_pw}
            onChange={(e) => setUserPw(e.target.value)}
          />
          <label htmlFor="user_pw">User PW</label>
        </div>
      </div>
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
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {userDeleteTable()}
            <br/>
            {buttonUserDelete()}
          </form>
        </div>
      </div>
    </div>
  );
};
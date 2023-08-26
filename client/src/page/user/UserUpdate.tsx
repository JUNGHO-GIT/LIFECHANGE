// UserUpdate.tsx
import React, {useState, useEffect} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const UserUpdate = () => {
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  const fetchUserUpdate = async () => {
    const user_id = window.sessionStorage.getItem("user_id");

    try {
      const res = await axios.post("http://127.0.0.1:4000/user/userDetail", {
        user_id: user_id,
      });
      setUserId(res.data.user_id);
    }
    catch (error : any) {
      if (error instanceof Error) {
        alert(`Error fetching user data: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchUserUpdate();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const UserUpdateFlow = async () => {

    if (user_pw === "" || user_pw === null) {
      alert("Please enter your password");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:4000/user/userCheckIdPw", {
        user_id: user_id,
        user_pw: user_pw,
      });
      if (res.data === "fail") {
        alert("Incorrect password");
        return;
      }
      if (res.data === "success") {
        const updatePw = prompt("Please enter a new password");

        try {
          const res = await axios.put("http://127.0.0.1:4000/user/userUpdate", {
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
        catch (error : any) {
          if (error instanceof Error) {
            alert(`Error fetching user data: ${error.message}`);
          }
        }
      }
    }
    catch (error : any) {
      if (error instanceof Error) {
        alert(`Error fetching user data: ${error.message}`);
      }
    }
  };

  const buttonUserUpdate = () => {
    return (
      <button className="btn btn-primary" type="button" onClick={UserUpdateFlow}>
        User Update
      </button>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const UserUpdateTable = () => {
    return (
      <>
      <div className="empty-h20"></div>
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
        <div className="empty-h20"></div>
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
  return (
    <div className="container">
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h1 className="mb-3 fw-9">User Update</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <form className="form-inline">
            {UserUpdateTable()}
            <div className="empty-h50"></div>
            {buttonUserUpdate()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserUpdate;
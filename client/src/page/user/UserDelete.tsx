// UserDelete.tsx
import React, {useState, useEffect} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const UserDelete = () => {
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  const fetchUserDelete = async () => {
    const user_id = window.sessionStorage.getItem("user_id");

    try {
      const res = await axios.post("http://127.0.0.1:4000/user/userDetail", {
        user_id: user_id,
      });
      setUserId(res.data.user_id);
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error fetching user data: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchUserDelete();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const UserDeleteFlow = async () => {

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

        try {
          const res = await axios.delete("http://127.0.0.1:4000/user/userDelete", {
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
        catch (error: any) {
          if (error instanceof Error) {
            alert(`Error fetching user data: ${error.message}`);
          }
        }
      }
    }
    catch (error: any) {
      if (error instanceof Error) {
        alert(`Error fetching user data: ${error.message}`);
      }
    }
  };

  const buttonUserDelete = () => {
    return (
      <button className="btn btn-primary" type="button" onClick={UserDeleteFlow}>
        User Delete
      </button>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const UserDeleteTable = () => {
    return (
      <>
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
          <h1 className="mb-3 fw-9">User Delete</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <form className="form-inline">
            {UserDeleteTable()}
            <div className="empty-h50"></div>
            {buttonUserDelete()}
          </form>
        </div>
      </div>
      <div className="empty-h200"></div>
    </div>
  );
};

export default UserDelete;
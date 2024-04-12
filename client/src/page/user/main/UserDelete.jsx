// UserDelete.jsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useDeveloperMode} from "../../../assets/hooks/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDelete = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "User Delete";
  const URL_USER = process.env.REACT_APP_URL_USER;
  const navParam = useNavigate();
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchUserDelete = async () => {
      const user_id = window.sessionStorage.getItem("user_id");
      try {
        const response = await axios.post (`${URL_USER}/detail`, {
          user_id: user_id,
        });
        setUserId(response.data.user_id);
        log("USER : " + JSON.stringify(response.data));
      }
      catch (e) {
        alert(`Error fetching user data: ${e.message}`);
      }
    };
    fetchUserDelete();
  }, []);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowUserDelete = async () => {
    try {
      if (user_pw === "" || user_pw === null) {
        alert("Please enter your password");
        return;
      }
      else {
        const response = await axios.post(`${URL_USER}/userCheckIdPw`, {
          user_id: user_id,
          user_pw: user_pw,
        });
        if (response.data === "fail") {
          alert("Incorrect password");
          return;
        }
        if (response.data === "success") {
          const response = await axios.delete (`${URL_USER}/userDelete`, {
            params: {
              user_id : user_id,
            }
          });
          if (response.data === "success") {
            alert("User Delete Success");
            window.sessionStorage.clear();
            navParam("/");
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
    catch (e) {
      alert(`Error fetching user data: ${e.message}`);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableUserDelete = () => {
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

  // 9. button ------------------------------------------------------------------------------------>
  const buttonUserDelete = () => {
    return (
      <button className="btn btn-sm btn-primary" type="button" onClick={flowUserDelete}>
        Delete
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <form className="form-inline">
            {tableUserDelete()}
            <br/>
            {buttonUserDelete()}
            {buttonRefreshPage()}
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};
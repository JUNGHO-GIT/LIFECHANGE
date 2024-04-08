// UserList.jsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "User List";
  const URL_USER = process.env.REACT_APP_URL_USER;
  const navParam = useNavigate();
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [USER_LIST, setUSER_LIST] = useState<[]> ([]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axios.get (`${URL_USER}/userList`);
        setUSER_LIST(response.data);
        log("USER_LIST : " + JSON.stringify(response.data));
      }
      catch (e) {
        alert(`Error fetching user data: ${e.message}`);
        setUSER_LIST([]);
      }
    };
    fetchUserList();
  }, []);

  // 3. flow -------------------------------------------------------------------------------------->

  // 4. view -------------------------------------------------------------------------------------->

  // 6. table ------------------------------------------------------------------------------------->
  const tableUserList = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>User ID</th>
            <th>User PW</th>
          </tr>
        </thead>
        <tbody>
          {USER_LIST.map((key) => (
            <tr>
              <td>{key.user_id}</td>
              <td>{key.user_pw}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
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
            {tableUserList()}
            <br/>
            {buttonRefreshPage()}
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};
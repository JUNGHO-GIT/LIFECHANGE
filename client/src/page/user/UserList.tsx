// UserList.tsx
import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
const UserList = () => {

  const [userList, setUserList] = useState<[]>([]);
  const URL = "http://127.0.0.1:4000/user";
  const TITLE = "User List";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axios.get (`${URL}/userList`);
        setUserList(response.data);
      }
      catch (error: any) {
        alert(`Error fetching user data: ${error.message}`);
        setUserList([]);
      }
    };
    fetchUserList();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const userListTable = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">User ID</th>
            <th scope="col">User PW</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((key:any, value:any) => (
            <tr>
              <td>{key.user_id}</td>
              <td>{key.user_pw}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonRefreshPage = () => {
    return (
      <Link to="/userList">
        <button type="button" className="btn btn-success">Refresh</button>
      </Link>
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
            {userListTable()}
            <div className="he-50"></div>
            {buttonRefreshPage()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserList;
// UserList.tsx
import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
const UserList = () => {
  const [UserList, setUserList] = useState<[]>([]);

  const fetchUserList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/user/userList");
      setUserList(response.data);
    }
    catch (err) {
      console.error(err);
      setUserList([]);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const buttonRefreshPage = () => {
    return (
      <Link to="/userList">
        <button type="button" className="btn btn-success">Refresh</button>
      </Link>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const UserListTable = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">User ID</th>
            <th scope="col">User PW</th>
          </tr>
        </thead>
        <tbody>
          {UserList.map((user:any) => (
            <tr key={user._id}>
              <td>{user.user_id}</td>
              <td>{user.user_pw}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h1 className="mb-3 fw-9">User List</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <form className="form-inline">
            {UserListTable()}
            <div className="empty-h50"></div>
            {buttonRefreshPage()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserList;
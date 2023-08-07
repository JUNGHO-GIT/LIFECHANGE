// UserList.tsx
import React, {useState, useEffect} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const UserListStyle = createGlobalStyle`
  .userList {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-userList {
    max-width: 330px;
    padding: 15px;
  }

  .form-userList .form-floating:focus-within {
    z-index: 2;
  }
`;

// ------------------------------------------------------------------------------------------------>
interface User {
  _id: string;
  userId: string;
  userPw: string;
}

// ------------------------------------------------------------------------------------------------>
const UserList = () => {
  const [UserList, setUserList] = useState<User[]>([]);

  const fetchUserList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/admin/userList");
      setUserList(response.data);
    }
    catch (err) {
      console.error(err);
      setUserList([]);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    fetchUserList();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const refreshUserList = () => {
    window.location.reload();
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div>
      <UserListStyle />
      <section className="userList custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">User List</h1>
          <div className="empty-h20"></div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">User ID</th>
                <th scope="col">User PW</th>
              </tr>
            </thead>
            <tbody>
              {UserList.map((user) => (
                <tr key={user._id}>
                  <td>{user.userId}</td>
                  <td>{user.userPw}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="empty-h100"></div>
          <button type="button" className="btn btn-primary" onClick={refreshUserList}>
            Refresh User List
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </div>
  );
};

export default UserList;

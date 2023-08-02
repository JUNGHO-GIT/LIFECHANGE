import React, {useState, useEffect} from "react";
import axios from "axios";

interface User {
  _id: string;
  userId: string;
  userPw: string;
}

const UserList = () => {
  const [UserList, setUserList] = useState<User[]>([]); // Initialize with empty array

  const fetchUserList = async () => {
    try {
      const response = await axios.get("http://localhost:4000/admin/userList");
      if (Array.isArray(response.data)) {
        setUserList(response.data);
      } else {
        console.error('Data received from server is not an array');
        setUserList([]);
      }
    }
    catch (err) {
      console.error(err);
      setUserList([]); // Setting to an empty array on error
    }
};

  useEffect(() => {
    fetchUserList();
  }, []); // On component mount

  return (
    <div>
      <button type="button" className="btn btn-primary" onClick={fetchUserList}>
        Refresh User List
      </button>
      <div className="empty-h50"></div>
      <table className="table table-striped table-hover">
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
    </div>
  );
};

export default UserList;

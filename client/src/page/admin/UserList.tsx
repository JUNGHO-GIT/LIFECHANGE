import React, {useState, useEffect} from "react";
import axios from "axios";

type User = {
  userId: string;
  userPw: string;
  secretKey: string;
};

// ------------------------------------------------------------------------------------------------>
const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/admin/userList");
        if (response.data !== "fail") {
          setUsers(response.data);
        }
        else {
          console.error("Failed to fetch user list");
        }
      }
      catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);


  // ---------------------------------------------------------------------------------------------->
  return (
    <div>
      {users.map((user, index) => (
        <div key={index}>{user.userId}</div>
      ))}
    </div>
  );
};

export default UserList;

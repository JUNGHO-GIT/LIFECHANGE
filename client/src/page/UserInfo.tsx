import React, {useState} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

const UserStyle = createGlobalStyle`
`;

// ------------------------------------------------------------------------------------------------>
const UserInfo = () => {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  const fetchUserInfo = async () => {
    const userId = window.sessionStorage.getItem("userId");

    try {
      const res = await axios.post("http://localhost:4000/api/userInfo", {
        userId: userId,
      });

      if (res.status === 200) {
        const {userId, userPw} = res.data;
        setUserId(userId);
        setUserPw(userPw);
      }
      else {
        throw new Error("Server responded with an error");
      }
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error fetching user data: ${error.message}`);
      }
    }
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div>
      <UserStyle />
      <div>
        <button onClick={fetchUserInfo}>Fetch User Info</button>
      </div>
      <div>
        <p>UserId: {userId}</p>
        <p>UserPw: {userPw}</p>
      </div>
    </div>
  );
};

export default UserInfo;
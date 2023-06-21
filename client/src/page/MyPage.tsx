import React, {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";
import {createGlobalStyle} from "styled-components";

interface UserResponse {
  userId: string;
  userPw: string;
}

const MyPageStyle = createGlobalStyle`
`;

// ------------------------------------------------------------------------------------------------>
const MyPage = () => {
  const [response, setResponse] = useState<UserResponse | null>(null);

  const MyPageFlow = async () => {
    const res: AxiosResponse<any, any> = await axios.post("http://localhost:4000/api/mypage");
    setResponse(res.data);
  };

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    MyPageFlow();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  return (
    <div>
      <MyPageStyle />
      <section className="mypage custom-flex-center">
        <h1 className="mb-3">My Page</h1>
        <div className="empty-h20"></div>
        <div className="form-floating">
          {response && (
            <div>
              <p>ID : {response.userId} </p>
              <p>PW : {response.userPw} </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyPage;

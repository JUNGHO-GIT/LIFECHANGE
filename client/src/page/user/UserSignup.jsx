// UserSignup.jsx

import {React, useState, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {Footer} from "../../import/ImportLayouts.jsx";
import {Div, Br20} from "../../import/ImportComponents.jsx";
import {Card, Paper, TextField} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserSignup = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toLogin:"/user/login",
    toSignup:"/user/signup"
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post (`${URL_OBJECT}/signup`, {
      user_id: userId,
      user_pw: userPw,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      navigate("/user/login");
    }
    else if (res.data.status === "duplicated") {
      alert(res.data.msg);
      setUserId("");
      setUserPw("");
    }
    else if (res.data.status === "fail") {
      alert(res.data.msg);
      setUserId("");
      setUserPw("");
    }
    else {
      alert(res.data.msg);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-7. fragment
    const tableFragment = (i=0) => (
      <Card className={"p-20"} key={i}>
        <Div className={"d-center"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"ID"}
            value={userId}
            onChange={(e) => (
              setUserId(e.target.value)
            )}
          />
        </Div>
        <Br20 />
        <Div className={"d-center"}>
          <TextField
            select={false}
            type={"password"}
            size={"small"}
            label={"Password"}
            value={userPw}
            onChange={(e) => (
              setUserPw(e.target.value)
            )}
          />
        </Div>
      </Card>
    );
    // 7-8. table
    const tableSection = () => (
      tableFragment(0)
    );
    // 7-9. first
    const firstSection = () => (
      <Card className={"border-none p-20"}>
        <Div className={"d-center fs-2-0rem"}>
          {translate("user-signup")}
        </Div>
      </Card>
    );
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-11. fourth
    const fourthSection = () => (
      <Card className={"border-none p-20"}>
        <Div className={"d-center"}>
          이미 계정이 있는 경우
          <Div className={"d-center blue ms-10"} onClick={() => {
            navigate("/user/login");
          }}>
            로그인
          </Div>
        </Div>
      </Card>
    );
    // 7-11. fifth
    // 7-11. sixth
    // 7-11. seventh
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper d-column h-min92vh"}>
          {firstSection()}
          {thirdSection()}
          {fourthSection()}
        </Div>
      </Paper>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
    </>
  );
};
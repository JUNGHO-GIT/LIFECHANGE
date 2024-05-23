// UserLogin.jsx

import {React, useState, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {percent} from "../../import/ImportLogics";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Card, Paper, TextField} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);

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
    const res = await axios.post (`${URL_OBJECT}/login`, {
      user_id: userId,
      user_pw: userPw,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      sessionStorage.setItem("sessionId", userId);
      sessionStorage.setItem("dataSet", JSON.stringify(res.data.result.dataSet));
      percent();
      navigate("/calendar/list");
    }
    else {
      alert(res.data.msg);
      sessionStorage.setItem("sessionId", "");
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-7. fragment
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"ID"}
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"Password"}
            value={userPw}
            onChange={(e) => {
              setUserPw(e.target.value);
            }}
          />
        </Div>
        <Div className={"d-center"}>
          <Div className={"fs-0-7rem"}>아이디 저장</Div>
        </Div>
      </Card>
    );
    // 7-8. table
    const tableSection = () => (
      tableFragment(0)
    );
    // 7-9. first
    const firstSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        <Div className={"fs-2-0rem"}>Login</Div>
      </Card>
    );
    // 7-10. second (x)
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min65vh"}>
          {firstSection()}
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

  // 9. footer ------------------------------------------------------------------------------------>
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        SEND
      }}
      functions={{
        setSEND
      }}
      handlers={{
        navigate, flowSave
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};
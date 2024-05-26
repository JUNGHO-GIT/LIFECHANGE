// UserLogin.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {percent, log} from "../../import/ImportLogics";
import {Div, Br10, Br20, Img, Hr20} from "../../import/ImportComponents.jsx";
import {Card, Paper, TextField, Button, Checkbox, Divider} from "../../import/ImportMuis.jsx";
import {user1} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;

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
  const [isChecked, setIsChecked] = useState(false);
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      setUserId(sessionId);
      setIsChecked(true);
    }
  }, []);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post (`${URL_OBJECT}/login`, {
      user_id: userId,
      user_pw: userPw,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      if (isChecked) {
        localStorage.setItem("sessionId", userId);
      }
      else {
        localStorage.setItem("sessionId", "");
      }
      sessionStorage.setItem("sessionId", userId);
      sessionStorage.setItem("dataCustom", JSON.stringify(res.data.result.dataCustom));
      sessionStorage.setItem("lang", "ko");
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
    const tableFragment = (i=0) => (
      <Card className={"border-none p-10"} key={i}>
        <Div className={"d-center"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"ID"}
            className={"w-86vw"}
            value={userId}
            InputProps={{
              readOnly: false,
              startAdornment: null,
              endAdornment: null,
            }}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
          />
        </Div>
        <Br20 />
        <Div className={"d-center"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"Password"}
            value={userPw}
            className={"w-86vw"}
            InputProps={{
              readOnly: false,
              startAdornment: null,
              endAdornment: null,
            }}
            onChange={(e) => {
              setUserPw(e.target.value);
            }}
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
      <Div className={"d-center fs-2-0rem"}>
        {translate("user-login")}
      </Div>
    );
    // 7-11. second
    const secondSection = () => (
      tableSection()
    );
    // 7-11. third
    const thirdSection = () => (
      <Div className={"d-center"}>
        <Checkbox
          color={"primary"}
          size={"small"}
          checked={isChecked}
          onChange={(e) => {
            setIsChecked(e.target.checked);
          }}
        />
        <Div className={"fs-0-8rem"}>
          아이디 저장
        </Div>
      </Div>
    );
    // 7-11. fourth
    const fourthSection = () => (
      <Div className={"d-center w-86vw"}>
        <Button
          size={"small"}
          color={"primary"}
          className={"w-100p fs-1-0rem"}
          variant={"contained"}
          onClick={() => {
            flowSave();
          }}
        >
          {translate("user-login")}
        </Button>
      </Div>
    );
    // 7-11. fifth
    const fifthSection = () => (
      <Div className={"d-center w-86vw"}>
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          value={translate("user-googleLogin")}
          className={"w-100p bg-white"}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <Img src={user1} className={"w-15 h-15"} />
            ),
            endAdornment: null,
          }}
        />
      </Div>
    );
    // 7-11. sixth
    const sixthSection = () => (
      <Div className={"d-center w-86vw fs-0-8rem"}>
        {translate("user-notId")}
        <Div className={"d-center blue ms-10"} onClick={() => {
          navigate("/user/signup");
        }}>
          {translate("user-signup")}
        </Div>
      </Div>
    );
    // 7-11. seventh
    const seventhSection = () => (
      <Div className={"d-center w-86vw fs-0-8rem"}>
        {translate("user-notPw")}
        <Div className={"d-center blue ms-10"} onClick={() => {
          navigate("/user/find");
        }}>
          {translate("user-find")}
        </Div>
      </Div>
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper d-column h-min92vh"}>
          {firstSection()}
          <Hr20 />
          {secondSection()}
          <Hr20 />
          {thirdSection()}
          <Hr20 />
          {fourthSection()}
          <Br10 />
          {fifthSection()}
          <Hr20 />
          {sixthSection()}
          <Br10 />
          {seventhSection()}
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
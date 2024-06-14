// UserLogin.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {percent, log} from "../../import/ImportLogics";
import {Div, Br10, Br20, Img, Hr20, Hr30, Hr40} from "../../import/ImportComponents.jsx";
import {Paper, TextField, Button, Checkbox} from "../../import/ImportMuis.jsx";
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
      sessionStorage.setItem("dataCategory", JSON.stringify(res.data.result.user.dataCategory));
      sessionStorage.setItem("defaultCategory", JSON.stringify(res.data.result.defaultCategory));
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
    const tableFragment = (i) => (
      <Div className={"d-column"} key={i}>
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={translate("id")}
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
        <Br10 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={translate("pw")}
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
        <Br10 />
        <Div className={"d-center"}>
          <Div className={"fs-0-8rem"}>
            {translate("saveId")}
          </Div>
          <Checkbox
            color={"primary"}
            size={"small"}
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.checked);
            }}
          />
        </Div>
      </Div>
    );
    // 7-8. table
    const tableSection = () => (
      tableFragment(0)
    );
    // 7-9. first
    const firstSection = () => (
      <Div className={"d-center fs-2-0rem"}>
        {translate("login")}
      </Div>
    );
    // 7-9. second
    const secondSection = () => (
      tableSection()
    );
    // 7-9. fourth
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
          {translate("login")}
        </Button>
      </Div>
    );
    // 7-9. fifth
    const fifthSection = () => (
      <Div className={"d-center w-86vw"}>
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          value={translate("googleLogin")}
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
    // 7-9. sixth
    const sixthSection = () => (
      <Div className={"d-center w-86vw fs-0-8rem"}>
        {translate("notId")}
        <Div className={"d-center blue pointer ms-10"} onClick={() => {
          navigate("/user/signup");
        }}>
          {translate("signup")}
        </Div>
      </Div>
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper d-column h-min94vh"}>
          {firstSection()}
          <Hr40 />
          {secondSection()}
          <Hr40 />
          {fourthSection()}
          <Br10 />
          {fifthSection()}
          <Hr40 />
          {sixthSection()}
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
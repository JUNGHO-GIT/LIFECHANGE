// UserSignup.jsx

import {React, useState, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {Div, Br10, Br20, Img, Hr40, Hr20} from "../../import/ImportComponents.jsx";
import {Paper, TextField, Button} from "../../import/ImportMuis.jsx";
import {user1} from "../../import/ImportImages.jsx";

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
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [serverCode, setServerCode] = useState("");
  const [clientCode, setClientCode] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSend = async () => {
    const res = await axios.post (`${URL_OBJECT}/send`, {
      user_id: userId,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      setServerCode(res.data.result.code);
    }
    else {
      alert(res.data.msg);
    }
  };

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
      navigate(0);
    }
  };

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCheck = () => {
    if (clientCode === serverCode) {
      alert(translate("isVerified"));
    }
    else {
      alert(translate("isNotVerified"));
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-7. fragment
    const tableFragment = (i) => (
      <Div className={"d-column"} key={i}>
        <Div className={"d-center w-86vw"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={`${translate("id")} (email)`}
            value={userId}
            className={"w-66vw me-10"}
            onChange={(e) => (
              setUserId(e.target.value)
            )}
          />
          <Button
            size={"small"}
            color={"primary"}
            className={"w-20vw"}
            variant={"contained"}
            onClick={() => {
              flowSend();
            }}
          >
            {translate("send")}
          </Button>
        </Div>
        <Br10 />
        <Div className={"d-center w-86vw"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("verified")}
            value={clientCode}
            className={"w-66vw me-10"}
            onChange={(e) => (
              setClientCode(e.target.value)
            )}
          />
          <Button
            size={"small"}
            color={"primary"}
            className={"w-20vw"}
            variant={"contained"}
            onClick={() => {
              handlerCheck();
            }}
          >
            {translate("verified")}
          </Button>
        </Div>
        <Br10 />
        <TextField
          select={false}
          type={"password"}
          size={"small"}
          label={translate("pw")}
          value={userPw}
          className={"w-86vw"}
          onChange={(e) => (
            setUserPw(e.target.value)
          )}
        />
      </Div>
    );
    // 7-8. table
    const tableSection = () => (
      tableFragment(0)
    );
    // 7-9. first
    const firstSection = () => (
      <Div className={"d-center fs-2-0rem"}>
        {translate("signup")}
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
          {translate("signup")}
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
          value={translate("googleSignup")}
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
        {translate("alreadyId")}
        <Div className={"d-center blue pointer ms-10"} onClick={() => {
          navigate("/user/login");
        }}>
          {translate("login")}
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
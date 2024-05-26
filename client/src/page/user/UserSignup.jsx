// UserSignup.jsx

import {React, useState, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {Div, Br20, Img} from "../../import/ImportComponents.jsx";
import {Card, Paper, TextField, Button} from "../../import/ImportMuis.jsx";
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
            className={"w-86vw"}
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
            className={"w-86vw"}
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
      <Div className={"d-center fs-2-0rem"}>
        {translate("user-signup")}
      </Div>
    );
    // 7-11. second
    const secondSection = () => (
      tableSection()
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
          {translate("user-signup")}
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
          value={translate("user-googleSignup")}
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
        {translate("user-alreadyId")}
        <Div className={"d-center blue ms-10"} onClick={() => {
          navigate("/user/login");
        }}>
          {translate("user-login")}
        </Div>
      </Div>
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper d-column h-min92vh"}>
          {firstSection()}
          <Br20 />
          {secondSection()}
          <Br20 />
          {fourthSection()}
          <Br20 />
          {fifthSection()}
          <Br20 />
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
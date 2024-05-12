// UserLogin.jsx

import {React, useState, useNavigate} from "../../import/ImportReacts.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts.jsx";
import {Div, Hr, Br, Btn, Loading, PopAlert, PopDown} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {TextField} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const navParam = useNavigate();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post (`${URL_OBJECT}/login`, {
      user_id: user_id,
      user_pw: user_pw,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      sessionStorage.setItem("user_id", user_id);
      sessionStorage.setItem("dataset", JSON.stringify(res.data.result.user_dataset));
      percent();
      navParam("/calendar/list");
    }
    else {
      alert(res.data.msg);
      sessionStorage.setItem("user_id", "false");
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. title
    const titleSection = () => (
      <p className={"fs-15"}>
        로그인
      </p>
    );
    // 7-6. table
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            id={"user_id"}
            name={"user_id"}
            key={"user_id"}
            label={"ID"}
            value={user_id}
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
            id={"user_pw"}
            name={"user_pw"}
            label={"Password"}
            value={user_pw}
            onChange={(e) => {
              setUserPw(e.target.value);
            }}
          />
        </Div>
      </Card>
    );
    // 7-7. table
    const tableSection = () => (
      <Div className={"block-wrapper h-74vh"}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%"
        }}
      >
        <Div className={"d-center p-10"}>
          {titleSection()}
        </Div>
        <Div className={"d-column"}>
          {tableFragment(0)}
        </Div>
      </Div>
    );
    // 7-8. return
    return (
      <Paper className={"content-wrapper"} variant={"outlined"}>
        {tableSection()}
      </Paper>
    );
  };

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={""} setDAYPICKER={""} DATE={""} setDATE={""}
      SEND={""}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam} part={"user"} plan={""} type={"login"}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING} />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </>
  );
};
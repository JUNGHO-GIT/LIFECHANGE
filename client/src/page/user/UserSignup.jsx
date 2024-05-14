// UserSignup.jsx

import {React, useState, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {Header, NavBar, Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Adornment, Icons, PopUp, Div} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {TextField} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserSignup = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const navigate = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const planStr = PATH?.split("/")[3] ? "plan" : "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    if (user_id === "" || user_pw === "") {
      alert("Please enter both Id and Pw");
      return;
    }
    const res = await axios.post (`${URL_OBJECT}/signup`, {
      user_id: user_id,
      user_pw: user_pw,
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
            label={"ID"}
            value={user_id}
            onChange={(e) => (
              setUserId(e.target.value)
            )}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"password"}
            size={"small"}
            id={"user_pw"}
            name={"user_pw"}
            label={"Password"}
            value={user_pw}
            onChange={(e) => (
              setUserPw(e.target.value)
            )}
          />
        </Div>
      </Card>
    );
    // 7-7. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min400"}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%"
        }}
      >
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

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 9. footer ------------------------------------------------------------------------------------>
  const footerNode = () => (
    <Footer
      strings={{
        part: partStr,
        type: typeStr,
        plan: planStr,
      }}
      objects={{

      }}
      functions={{

      }}
      handlers={{
        navigate, flowSave
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};
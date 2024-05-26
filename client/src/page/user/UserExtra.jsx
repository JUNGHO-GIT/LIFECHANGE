// UserExtra.jsx

import {React, useState, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {percent, log} from "../../import/ImportLogics.jsx";
import {Div, Br10, Br20, Img, Hr40, Br30} from "../../import/ImportComponents.jsx";
import {Paper, TextField, Button} from "../../import/ImportMuis.jsx";
import {Avatar} from "@mui/material";
import {user1} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserExtra = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    user_id: "",
    user_number: 0,
    user_sex: "",
    user_age: "",
    user_height: "",
    user_weight: "",
    user_image: "",
    user_property: 0,
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post (`${URL_OBJECT}/extra`, {
      user_id: sessionId,
      OBJECT: OBJECT,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      navigate("/user/login");
    }
    else {
      alert(res.data.msg);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-7. fragment
    const tableFragment = (i=0) => (
      <Div className={"d-column"} key={i}>
        <Avatar
          alt={"user_image"}
          src={OBJECT?.user_image}
          className={"m-auto w-150 h-150"}
        />
        <Br30 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={"ID"}
          value={OBJECT?.user_id}
          className={"w-86vw"}
          onChange={(e) => {
            setOBJECT({
              ...OBJECT,
              user_id: e.target.value
            });
          }}
        />
        <Br20 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={"sex"}
          value={OBJECT?.user_sex}
          className={"w-86vw"}
          onChange={(e) => {
            setOBJECT({
              ...OBJECT,
              user_sex: e.target.value
            });
          }}
        />
        <Br20 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={"age"}
          value={OBJECT?.user_age}
          className={"w-86vw"}
          onChange={(e) => {
            setOBJECT({
              ...OBJECT,
              user_age: e.target.value
            });
          }}
        />
        <Br20 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={"height"}
          value={OBJECT?.user_height}
          className={"w-86vw"}
          onChange={(e) => {
            setOBJECT({
              ...OBJECT,
              user_height: e.target.value
            });
          }}
        />
        <Br20 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={"weight"}
          value={OBJECT?.user_weight}
          className={"w-86vw"}
          onChange={(e) => {
            setOBJECT({
              ...OBJECT,
              user_weight: e.target.value
            });
          }}
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
        {translate("user-signup")}
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
          {translate("user-signup")}
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
    // 7-9. sixth
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
    // 7-10. return
    return (
      <Paper className={"content-wrapper"}>
        <Div className={"block-wrapper d-column h-min92vh"}>
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
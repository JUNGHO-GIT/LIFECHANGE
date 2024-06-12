// UserDeletes.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {Div, Br10, Br20, Img, Hr40, Hr20} from "../../import/ImportComponents.jsx";
import {Paper, TextField, Button, TextArea} from "../../import/ImportMuis.jsx";
import {user1} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDeletes = () => {

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
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [EXIST, setEXIST] = useState([""]);

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    version: "",
    date: "",
    github: "",
    license: ""
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/info`, {
      params: {
        user_id: sessionId,
      },
    })
    .then(res => {
      setOBJECT(res.data.result);
    })
    .catch(error => {
      console.error('Error fetching data', error);
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post (`${URL_OBJECT}/deletes`, {
      user_id: sessionId,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      navigate("/user/login");
    }
    else {
      alert(res.data.msg);
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
          label={translate("user-id")}
          value={sessionId}
          className={"w-86vw"}
          InputProps={{
            readOnly: true,
          }}
        />
        <Br10 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={translate("user-signupDate")}
          value={OBJECT.date}
          className={"w-86vw"}
          InputProps={{
            readOnly: true,
          }}
        />
        <Br10 />
        <TextArea
          readOnly={false}
          className={"w-86vw h-30vh border p-10 pointer"}
          value={`회원정보를 삭제하시겠습니까? 삭제 후에는 복구가 불가능합니다.`}
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
        {translate("user-deletes")}
      </Div>
    );
    // 7-9. second
    const secondSection = () => (
      tableSection()
    );
    // 7-9. third
    const thirdSection = () => (
      <Div className={"d-center w-86vw"}>
        <Button
          size={"small"}
          color={"error"}
          className={"w-100p fs-1-0rem"}
          variant={"contained"}
          onClick={() => {
            flowSave();
          }}
        >
          {translate("user-deletes")}
        </Button>
      </Div>
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper d-column h-min84vh"}>
          {firstSection()}
          <Hr40 />
          {secondSection()}
          <Hr40 />
          {thirdSection()}
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
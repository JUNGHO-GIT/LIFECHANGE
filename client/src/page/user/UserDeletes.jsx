// UserDeletes.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {Div, Br10, Br20, Img, Hr40, Hr20} from "../../import/ImportComponents.jsx";
import {Paper, TextField, Button, TextArea} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const UserDeletes = () => {

  // 1. common -------------------------------------------------------------------------------------
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

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [EXIST, setEXIST] = useState([""]);

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    version: "",
    date: "",
    github: "",
    license: ""
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
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
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    await axios.delete(`${URL_OBJECT}/deletes`, {
      data: {
        user_id: sessionId,
      },
    })
    .then((res) => {
      if (res.data.status === "success") {
        navigate("/user/login");
      }
      else {
        alert(res.data.msg);
        navigate(0);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  };

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Div className={"d-center fs-2-0rem"}>
        {translate("deletes")}
      </Div>
    );
    // 7-2. table
    const tableSection = () => {
      const tableFragment = (i) => (
        <Div className={"d-column"} key={i}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("id")}
            value={sessionId}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
            }}
          />
          <Br20 />
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("signupDate")}
            value={OBJECT.date}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
            }}
          />
          <Br20 />
          <TextArea
            readOnly={false}
            className={"w-76vw h-10vh border shadow-none p-10 pointer"}
            value={`삭제 후에는 복구가 불가능합니다.\n정말로 삭제하시겠습니까?`}
          />
        </Div>
      );
      return (
        tableFragment(0)
      );
    };
    // 7-3. button
    const buttonSection = () => (
      <Div className={"d-center w-76vw"}>
        <Button
          size={"small"}
          color={"error"}
          className={"w-100p fs-1-0rem"}
          variant={"contained"}
          onClick={() => {
            flowSave();
          }}
        >
          {translate("deletes")}
        </Button>
      </Div>
    );

    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper d-column h-min84vh"}>
          {titleSection()}
          <Hr40 />
          {tableSection()}
          <Hr40 />
          {buttonSection()}
        </Div>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
    </>
  );
};
// UserDataInfo.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useRef} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {Div, Br30, Br20, Img, Hr40, Hr20} from "../../../import/ImportComponents.jsx";
import {Paper, TextField, Button, Avatar} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDataInfo = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataCustom") || "{}";
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const PATH = location?.pathname;

  // 2-2. useState -------------------------------------------------------------------------------->
  /** @type {React.MutableRefObject<IntersectionObserver|null>} **/
  const observer = useRef(null);
  const [LOADING, setLOADING] = useState(false);
  const [MORE, setMORE] = useState(true);
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toDataCustom: "/user/data/custom",
  });
  const [DATE, setDATE] = useState({
    dateType: "day",
    dateStart: location_dateStart,
    dateEnd: location_dateEnd,
  });

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
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      navigate(SEND.toDataCustom);
    }
    else {
      alert(res.data.msg);
      sessionStorage.setItem("dataCustom", JSON.stringify(OBJECT_DEF.dataCustom));
    }
  };

  // 6. table ------------------------------------------------------------------------------------->
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
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper d-column h-min85vh"}>
          {firstSection()}
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
// UserDataInfo.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {axios, moment} from "../../../import/ImportLibs.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Icons, Br20} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Button} from "../../../import/ImportMuis.jsx";
import {TableContainer, Table, TableFooter} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDataInfo = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataCustom") || "{}";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const exerciseArray = JSON.parse(session)?.exercise || [];
  const foodArray = JSON.parse(session)?.food || [];
  const moneyArray = JSON.parse(session)?.money || [];
  const sleepArray = JSON.parse(session)?.sleep || [];
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const dataCustomArray = ["exercise", "food", "calendar", "money", "sleep"];

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
        <Div className={"block-wrapper h-min85vh"}>
          {firstSection()}
        </Div>
      </Paper>
    );
  };

  // 9. footer ------------------------------------------------------------------------------------>
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND
      }}
      functions={{
        setDATE, setSEND
      }}
      handlers={{
        navigate, flowSave
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};
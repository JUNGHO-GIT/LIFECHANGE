// UserDataMain.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {axios, moment} from "../../../import/ImportLibs.jsx";
import {PopUp, Div, Icons, Br20} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Button} from "../../../import/ImportMuis.jsx";
import {TableContainer, Table, TableFooter} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDataMain = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
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
    dateEnd: "0000-00-00"
  });
  const [DATE, setDATE] = useState({
    dateType: "day",
    dateStart: location_dateStart,
    dateEnd: location_dateEnd,
  });
  const [idx, setIdx] = useState({
    sectionIdx: 0,
    partIdx: 1,
    titleIdx: 1
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      sessionStorage.setItem("dataCustom", JSON.stringify(res.data.result.dataCustom));
    }
    else {
      alert(res.data.msg);
      sessionStorage.setItem("dataCustom", JSON.stringify(OBJECT_DEF.dataCustom));
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-7. fragment
    const tableFragment = (i=0) => (
      <Card variant={"outlined"} className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
            <TableBody className={"table-tbody"}>
              <TableRow>
                <TableCell className={"w-80vw border-right"}>123123</TableCell>
                <TableCell className={"w-10vw"}>123123</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-80vw border-right"}>123123</TableCell>
                <TableCell className={"w-10vw"}>123123</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-80vw border-right"}>123123</TableCell>
                <TableCell className={"w-10vw"}>123123</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-80vw border-right"}>123123</TableCell>
                <TableCell className={"w-10vw"}>123123</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-80vw border-right"}>123123</TableCell>
                <TableCell className={"w-10vw"}>123123</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-80vw border-right"}>123123</TableCell>
                <TableCell className={"w-10vw"}>123123</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-80vw border-right"}>123123</TableCell>
                <TableCell className={"w-10vw"}>123123</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-80vw border-right"}>123123</TableCell>
                <TableCell className={"w-10vw"}>123123</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-80vw border-right"}>123123</TableCell>
                <TableCell className={"w-10vw"}>123123</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-80vw border-right"}>123123</TableCell>
                <TableCell className={"w-10vw"}>123123</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-80vw border-right"}>123123</TableCell>
                <TableCell className={"w-10vw"}>123123</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-8. table
    const tableSection = () => (
      tableFragment(0)
    );
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper d-row h-min85vh"}>
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
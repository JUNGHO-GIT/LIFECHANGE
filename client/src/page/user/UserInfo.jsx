// UserInfo.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {axios} from "../../import/ImportLibs.jsx"
import {PopUp, Div, Icons, Br20, Img, Br40} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../import/ImportMuis.jsx";
import {TableBody, TableRow, TableCell, TableHead} from "../../import/ImportMuis.jsx";
import {logo1} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserInfo = () => {


  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
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
    setLOADING(true); // Start loading
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
      setLOADING(false); // Stop loading
    });
  })()}, [sessionId]);

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6. img
    const imageSection = () => (
      <Div className={"d-center mt-n100"}>
      <Img src={logo1} alt={"logo1"} className={"w-240 h-200"} />
      </Div>
    );
    // 7-7. fragment
    const tableFragment = (i=0) => (
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
            <TableBody className={"table-tbody"}>
              <TableRow>
                <TableCell className={"w-40vw"}>
                  version
                </TableCell>
                <TableCell className={"w-60vw"}>
                  {OBJECT.version}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-40vw"}>
                  date
                </TableCell>
                <TableCell className={"w-60vw"}>
                  {OBJECT.date}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-40vw"}>
                  github
                </TableCell>
                <TableCell className={"w-60vw"}>
                  {OBJECT.git}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-40vw"}>
                  license
                </TableCell>
                <TableCell className={"w-60vw"}>
                  {OBJECT.license}
                </TableCell>
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
    // 7-9. first
    const firstSection = () => (
      imageSection()
    );
    // 7-9. second
    const secondSection = () => (
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper d-column h-min85vh"}>
          {firstSection()}
          <Br40 />
          {secondSection()}
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
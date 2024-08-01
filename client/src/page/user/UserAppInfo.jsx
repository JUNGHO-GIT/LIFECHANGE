// UserAppInfo.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {axios} from "../../import/ImportLibs.jsx"
import {PopUp, Div, Icons, Br20, Img, Br40} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../import/ImportMuis.jsx";
import {TableBody, TableRow, TableCell, TableHead} from "../../import/ImportMuis.jsx";
import {logo1} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const UserAppInfo = () => {


  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
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
    axios.get(`${URL_OBJECT}/app/info`, {
      params: {
        user_id: sessionId,
      },
    })
    .then(res => {
      setOBJECT(res.data.result || OBJECT_DEF);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId]);

  // 6. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. image
    const imageSection = () => (
      <Div className={"d-center"}>
        <Img src={logo1} alt={"logo1"} className={"w-240 h-200"} />
      </Div>
    );
    // 7-2. table
    const tableSection = () => {
      const tableFragment = (i) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <TableContainer>
            <Table>
              <TableBody className={"table-tbody"}>
                <TableRow>
                  <TableCell className={"w-40vw fs-1-0rem p-15"}>
                    version
                  </TableCell>
                  <TableCell className={"w-55vw fs-0-8rem p-15"}>
                    {OBJECT.version}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={"w-40vw fs-1-0rem p-15"}>
                    date
                  </TableCell>
                  <TableCell className={"w-55vw fs-0-8rem p-15"}>
                    {OBJECT.date}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={"w-40vw fs-1-0rem p-15"}>
                    github
                  </TableCell>
                  <TableCell className={"w-55vw fs-0-8rem p-15"}>
                    {OBJECT.git}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={"w-40vw fs-1-0rem p-15"}>
                    license
                  </TableCell>
                  <TableCell className={"w-55vw fs-0-8rem p-15"}>
                    {OBJECT.license}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      );
      return (
        tableFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper d-column h-min85vh"}>
          {imageSection()}
          <Br40 />
          {tableSection()}
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
// UserDataInfo.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {PopUp, Div, Icons, Br20, Img} from "../../../import/ImportComponents.jsx";
import {Card, Paper} from "../../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../../import/ImportMuis.jsx";
import {TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";
import {flag1, flag2} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDataInfo = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [lang, setLang] = useState(sessionStorage.getItem('lang'));

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-7. fragment
    const tableFragment = (i=0) => (
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
            <TableBody className={"table-tbody"}>
              <TableRow>
                <TableCell className={"w-90vw"}>
                  version
                </TableCell>
                <TableCell className={"w-10vw"}>
                  1.0.0
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
    // 7-9. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper"}>
        <Div className={"block-wrapper d-row h-min87vh"}>
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
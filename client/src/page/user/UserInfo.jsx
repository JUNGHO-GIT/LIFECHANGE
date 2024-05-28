// UserInfo.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {PopUp, Div, Icons, Br20, Img} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../import/ImportMuis.jsx";
import {TableBody, TableRow, TableCell, TableHead} from "../../import/ImportMuis.jsx";
import {logo1} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserInfo = () => {

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6. img
    const imageSection = () => (
      <Img src={logo1} alt={"logo1"} className={"w-240 h-200"} />
    );
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
              <TableRow>
                <TableCell className={"w-90vw"}>
                  version
                </TableCell>
                <TableCell className={"w-10vw"}>
                  1.0.0
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-90vw"}>
                  version
                </TableCell>
                <TableCell className={"w-10vw"}>
                  1.0.0
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-90vw"}>
                  version
                </TableCell>
                <TableCell className={"w-10vw"}>
                  1.0.0
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-90vw"}>
                  version
                </TableCell>
                <TableCell className={"w-10vw"}>
                  1.0.0
                </TableCell>
              </TableRow>
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
      <Paper className={"content-wrapper"}>
        <Div className={"block-wrapper d-column h-min78vh"}>
          {firstSection()}
          <Br20 />
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
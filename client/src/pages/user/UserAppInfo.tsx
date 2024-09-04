// UserAppInfo.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";
import { axios } from "@imports/ImportLibs"
import { Loading } from "@imports/ImportLayouts";
import { Img } from "@imports/ImportComponents";
import { Card, Paper, Grid } from "@imports/ImportMuis";
import { TableContainer, Table, TableBody, TableRow, TableCell } from "@imports/ImportMuis";
import { logo1 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const UserAppInfo = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    URL_OBJECT, sessionId
  } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF: any = {
    version: "",
    date: "",
    git: "",
    license: "",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/app/info`)
    .then((res: any) => {
      setOBJECT((prev: any) => ({
        ...prev,
        ...res.data.result
      }));
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId]);

  // 6. userAppInfo --------------------------------------------------------------------------------
  const userAppInfoNode = () => {
    // 7-1. image
    const imageSection = () => (
      <Img
        src={logo1}
        alt={"logo1"}
        className={"w-240 h-200"}
      />
    );
    // 7-2. card
    const cardSection = () => {
      const cardFragment = (i: number) => (
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
        LOADING ? <Loading /> : cardFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center radius border h-84vh"}>
        <Grid container spacing={4}>
          <Grid size={12} className={"d-center mb-30"}>
            {imageSection()}
          </Grid>
          <Grid size={12}>
            {cardSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userAppInfoNode()}
    </>
  );
};
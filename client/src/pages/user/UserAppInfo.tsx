// UserAppInfo.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { AppInfo } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportLibs"
import { Loading } from "@imports/ImportLayouts";
import { Img } from "@imports/ImportComponents";
import { Card, Paper, Grid } from "@imports/ImportMuis";
import { TableContainer, Table, TableBody, TableRow, TableCell } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserAppInfo = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    URL_OBJECT, sessionId, TITLE,
  } = useCommonValue();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>(AppInfo);
  const localLangSet:any = localStorage.getItem(`${TITLE}_localLangSet`);
  const timeZone: string = JSON.parse(localLangSet)?.timeZone || "";
  const zoneName: string = JSON.parse(localLangSet)?.zoneName || "";
  const locale: string = JSON.parse(localLangSet)?.locale || "";
  const isoCode: string = JSON.parse(localLangSet)?.isoCode || "";
  const currency: string = JSON.parse(localLangSet)?.currency || "";

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
        key={"logo1"}
        src={"logo1"}
        alt={"logo1"}
        className={"w-240 h-200"}
      />
    );
    // 7-2. card
    const detailSection = () => {
      const detailFragment = (i: number) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <TableContainer className={"over-hidden"}>
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
                <TableRow>
                  <TableCell className={"w-40vw fs-1-0rem p-15"}>
                    timezone
                  </TableCell>
                  <TableCell className={"w-55vw fs-0-7rem p-15"}>
                    {timeZone} | &nbsp; {zoneName} | &nbsp;
                    {locale} | &nbsp; {isoCode} | &nbsp; {currency}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      );
      return (
        LOADING ? <Loading /> : detailFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center radius border h-min90vh"}>
        <Grid container spacing={4}>
          <Grid size={12} className={"d-center mb-30"}>
            {imageSection()}
          </Grid>
          <Grid size={12}>
            {detailSection()}
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
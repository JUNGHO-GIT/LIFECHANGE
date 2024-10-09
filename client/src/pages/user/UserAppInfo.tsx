// UserAppInfo.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { AppInfo } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Img, Br } from "@imports/ImportComponents";
import { Card, Paper, Grid } from "@imports/ImportMuis";
import { TableContainer, Table, TableBody, TableRow, TableCell } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserAppInfo = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, TITLE, sessionId } = useCommonValue();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>(AppInfo);
  const localeSetting:any = localStorage.getItem(`${TITLE}_localeSetting`) || "{}";
  const timeZone: string = JSON.parse(localeSetting)?.timeZone || "";
  const zoneName: string = JSON.parse(localeSetting)?.zoneName || "";
  const locale: string = JSON.parse(localeSetting)?.locale || "";
  const isoCode: string = JSON.parse(localeSetting)?.isoCode || "";
  const currency: string = JSON.parse(localeSetting)?.currency || "";

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
      <Card className={"p-0"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12} className={"d-center"}>
            <Img
              key={"logo1"}
              src={"logo1"}
              className={"w-240 h-200"}
            />
          </Grid>
        </Grid>
      </Card>
    );
    // 7-2. card
    const detailSection = () => {
      const detailFragment = (i: number) => (
        <Card className={"border-1 radius-1 shadow-0 p-0"} key={i}>
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
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              {detailFragment(0)}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center border-1 radius-1 h-min90vh"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            {LOADING ? <Loading /> : (
              <>
                {imageSection()}
                <Br px={20} />
                {detailSection()}
              </>
            )}
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
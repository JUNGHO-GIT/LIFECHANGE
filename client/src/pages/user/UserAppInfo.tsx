// UserAppInfo.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { AppInfo } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Img, Br } from "@imports/ImportComponents";
import { Paper, Grid } from "@imports/ImportMuis";
import { TableContainer, Table, TableBody, TableRow, TableCell } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserAppInfo = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, TITLE, sessionId } = useCommonValue();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();

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
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
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
      <Grid container spacing={2} columns={12}>
        <Grid size={12} className={"d-center"}>
          <Img
            key={"logo1"}
            src={"logo1"}
            className={"w-240 h-200"}
          />
        </Grid>
      </Grid>
    );
    // 7-2. detail
    const detailSection = () => {
      const detailFragment = (item: any) => (
        <Grid container spacing={2} columns={12}>
          <Grid size={12} className={"border-1 radius-1 shadow-0"}>
            <TableContainer className={"over-hidden"}>
              <Table>
                <TableBody className={"table-tbody"}>
                  <TableRow>
                    <TableCell className={"w-40vw fs-1-0rem p-15"}>
                      version
                    </TableCell>
                    <TableCell className={"w-55vw fs-0-8rem p-15"}>
                      {item.version}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={"w-40vw fs-1-0rem p-15"}>
                      date
                    </TableCell>
                    <TableCell className={"w-55vw fs-0-8rem p-15"}>
                      {item.date}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={"w-40vw fs-1-0rem p-15"}>
                      github
                    </TableCell>
                    <TableCell className={"w-55vw fs-0-8rem p-15"}>
                      {item.git}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={"w-40vw fs-1-0rem p-15"}>
                      license
                    </TableCell>
                    <TableCell className={"w-55vw fs-0-8rem p-15"}>
                      {item.license}
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
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} key={`detail-${0}`}>
            {detailFragment(OBJECT)}
          </Grid>
        </Grid>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center border-1 radius-1 h-min90vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {imageSection()}
            <Br px={40} />
            {LOADING ? <Loading /> : detailSection()}
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
// AdminAppInfo.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue } from "@importHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@importStores";
import { axios } from "@importLibs";
import { AppInfo } from "@importSchemas";
import { Img, Br, Paper, Grid, Card } from "@importComponents";
import { TableContainer, Table, TableBody, TableRow, TableCell } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const AdminAppInfo = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_ADMIN, sessionId } = useCommonValue();
  const { localTimeZone, localZoneName, localLang } = useCommonValue();
  const { localIsoCode, localCurrency } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT, setOBJECT] = useState<any>(AppInfo);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_ADMIN}/appInfo`)
    .then((res: any) => {
      setOBJECT(res.data.result || AppInfo);
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_ADMIN, sessionId]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_ADMIN}/curEnv`)
    .then((res: any) => {
      setOBJECT((prev: any) => ({
        ...prev,
        env: res.data.result.env,
      }));
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_ADMIN, sessionId]);

  // 6. userAppInfo --------------------------------------------------------------------------------
  const userAppInfoNode = () => {
    // 7-1. image
    const imageSection = () => (
      <Grid container={true} spacing={2}>
        <Grid size={12} className={"d-center"}>
          <Img
            hover={true}
            shadow={false}
            radius={false}
            src={"logo1.webp"}
            className={"w-240px h-200px"}
          />
        </Grid>
      </Grid>
    );
    // 7-2. detail
    const detailSection = () => {
      const detailFragment = () => (
        <Grid container={true} spacing={0}>
          {[OBJECT].filter((_: any, idx: number) => idx === 0).map((item: any, i: number) => (
            <Grid container={true} spacing={2} className={"border-1 radius-2 shadow-0"} key={`detail-${i}`}>
              <Grid size={12} className={"d-center"}>
                <TableContainer className={"over-hidden"}>
                  <Table>
                    <TableBody className={"table-tbody"}>
                      <TableRow>
                        <TableCell className={"w-40vw fs-0-9rem p-15px"}>
                          version
                        </TableCell>
                        <TableCell className={"w-55vw fs-0-7rem p-15px"}>
                          {`${item.version}_${item.env}`}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={"w-40vw fs-0-9rem p-15px"}>
                          date
                        </TableCell>
                        <TableCell className={"w-55vw fs-0-7rem p-15px"}>
                          {item.date}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={"w-40vw fs-0-9rem p-15px"}>
                          license
                        </TableCell>
                        <TableCell className={"w-55vw fs-0-7rem p-15px"}>
                          {item.license}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={"w-40vw fs-0-9rem p-15px"}>
                          timezone
                        </TableCell>
                        <TableCell className={"w-55vw fs-0-7rem p-15px"}>
                          {localTimeZone} | {localZoneName} | {localLang} | {localIsoCode} | {localCurrency}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          ))}
        </Grid>
      );
      return (
        <Card className={"d-col-center border-0 shadow-0 radius-0"}>
          {detailFragment()}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center border-1 radius-2 h-min-90vh"}>
        {imageSection()}
        <Br m={40} />
        {detailSection()}
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
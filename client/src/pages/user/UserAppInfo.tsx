// UserAppInfo.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue } from "@importHooks";
import { useStoreLanguage, useStoreAlert } from "@importHooks";
import { axios } from "@importLibs";
import { AppInfo } from "@importSchemas";
import { Loader } from "@importLayouts";
import { Img, Br } from "@importComponents";
import { Paper, Grid, Card } from "@importMuis";
import { TableContainer, Table, TableBody, TableRow, TableCell } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const UserAppInfo = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId } = useCommonValue();
  const { localTimeZone, localZoneName, localLang } = useCommonValue();
  const { localIsoCode, localCurrency } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { ALERT, setALERT } = useStoreAlert();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>(AppInfo);

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
      setTimeout(() => {
        setLOADING(false);
      }, 100);
    });
  }, [URL_OBJECT, sessionId]);

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
            src={"logo1"}
            className={"w-240 h-200"}
          />
        </Grid>
      </Grid>
    );
    // 7-2. detail
    const detailSection = () => {
      const detailFragment = () => (
        <Grid container={true} spacing={0}>
          {[OBJECT].filter((_: any, idx: number) => idx === 0).map((item: any, i: number) => (
            <Grid container={true} spacing={2} className={"border-1 radius-1 shadow-0"} key={`detail-${i}`}>
              <Grid size={12} className={"d-center"}>
                <TableContainer className={"over-hidden"}>
                  <Table>
                    <TableBody className={"table-tbody"}>
                      <TableRow>
                        <TableCell className={"w-40vw fs-0-9rem p-15"}>
                          version
                        </TableCell>
                        <TableCell className={"w-55vw fs-0-7rem p-15"}>
                          {item.version}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={"w-40vw fs-0-9rem p-15"}>
                          date
                        </TableCell>
                        <TableCell className={"w-55vw fs-0-7rem p-15"}>
                          {item.date}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={"w-40vw fs-0-9rem p-15"}>
                          github
                        </TableCell>
                        <TableCell className={"w-55vw fs-0-7rem p-15"}>
                          {item.git}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={"w-40vw fs-0-9rem p-15"}>
                          license
                        </TableCell>
                        <TableCell className={"w-55vw fs-0-7rem p-15"}>
                          {item.license}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={"w-40vw fs-0-9rem p-15"}>
                          timezone
                        </TableCell>
                        <TableCell className={"w-55vw fs-0-7rem p-15"}>
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
        <Card className={"d-col-center"}>
          {detailFragment()}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center border-1 radius-1 h-min90vh"}>
        {LOADING ? <Loader /> : (
          <>
            {imageSection()}
            <Br px={40} />
            {detailSection()}
          </>
        )}
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
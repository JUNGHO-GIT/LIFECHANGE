// AdminDashboard.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate } from "@importHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@importHooks";
import { axios } from "@importLibs";
import { Footer } from "@importLayouts";
import { Input } from "@importContainers";
import { Div, Hr, Paper, Grid, Card } from "@importComponents";

// -------------------------------------------------------------------------------------------------
export const AdminDashboard = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT, setOBJECT] = useState<number | null>(null);
  const [DATE, setDATE] = useState<any>({
    dateType: "day",
    dateStart: getDayFmt(),
    dateEnd: getDayFmt(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/userCount`)
    .then((res: any) => {
      // 기본값 설정
      setOBJECT(res.data.result || 0);
    })
    .catch((err: any) => {
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
     });
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 7. detail -------------------------------------------------------------------------------------
  const detailNode = () => {
    // 7-2. detail
    const detailSection = () => {
      const detailFragment = () => (
        <Grid container={true} spacing={2} className={"border-1 radius-2 p-20px"}>
          <Grid container={true} spacing={2}>
            <Grid size={12}>
              <Div className={"fs-1-5rem fw-600"}>
                {`${DATE.dateStart}`}
              </Div>
            </Grid>
          </Grid>

          <Hr m={30} />

          <Grid container={true} spacing={2}>
            <Grid size={12}>
              <Input
                readOnly={true}
                label={translate("userCount")}
                value={`${OBJECT}`}
              />
            </Grid>
          </Grid>
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
      <Paper className={"content-wrapper border-1 radius-2 shadow-1 h-min-75vh"}>
        {detailSection()}
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE
      }}
      setState={{
        setDATE
      }}
      flow={{
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {detailNode()}
      {footerNode()}
    </>
  );
};
// AdminDashboard.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { axios } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Input }from "@imports/ImportContainers";
import { Div } from "@imports/ImportComponents";
import { Paper, Grid, Card } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const AdminDashboard = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<number | null>(null);
  const [DATE, setDATE] = useState<any>({
    dateType: "day",
    dateStart: getDayFmt(),
    dateEnd: getDayFmt(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/userCount`)
    .then((res: any) => {
      // 기본값 설정
      setOBJECT(res.data.result || 0);
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
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 7. detail -------------------------------------------------------------------------------------
  const detailNode = () => {
    // 7-1. date
    const dateCountSection = () => (
      <Grid container={true} spacing={2} className={"border-1 radius-1 p-20"}>
        <Grid size={12}>
          <Div className={"fs-1-5rem fw-600"}>
            {`${DATE.dateStart}`}
          </Div>
        </Grid>
      </Grid>
    );
    // 7-2. detail
    const detailSection = () => (
      <Grid container={true} spacing={2} className={"border-1 radius-1 p-20"}>
        <Grid size={12}>
          <Input
            readOnly={true}
            label={translate("userCount")}
            value={`${OBJECT}`}
          />
        </Grid>
      </Grid>
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        {dateCountSection()}
        {LOADING ? <Loading /> : detailSection()}
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
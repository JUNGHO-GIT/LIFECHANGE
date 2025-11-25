// AdminDashboard.tsx

import { useState, useEffect, memo } from "@exportReacts";
import { useCommonValue, useCommonDate } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { axios } from "@exportLibs";
import { Footer } from "@exportLayouts";
import { Input } from "@exportContainers";
import { Div, Hr, Paper, Grid } from "@exportComponents";

// -------------------------------------------------------------------------------------------------
export const AdminDashboard = memo(() => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT, setOBJECT] = useState<number | null>(null);
  const [DATE, setDATE] = useState({
    dateType: "day",
    dateStart: getDayFmt(),
    dateEnd: getDayFmt(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/userCount`)
    .then((res: any) => {
      setOBJECT(res.data.result || 0);
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
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 7. detail -------------------------------------------------------------------------------------
  const detailNode = () => {
    // 7-2. detail
		const dateSection = () => (
			<Grid container={true} spacing={2} className={"d-center"}>
				<Grid size={12}>
					<Div className={"fs-1-5rem fw-600"}>
						{`${DATE.dateStart}`}
					</Div>
				</Grid>
			</Grid>
		);
		// 7-3. count
		const countSection = () => (
			<Grid container={true} spacing={2} className={"d-center"}>
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
      <Paper className={"content-wrapper border-1 radius-2 shadow-1 h-min-75vh"}>
				<Grid container={true} spacing={2} className={"border-1 radius-2 p-20px"}>
					{dateSection()}
					<Hr px={15} />
					{countSection()}
				</Grid>
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
});
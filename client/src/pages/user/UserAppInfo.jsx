// UserAppInfo.jsx
// Node -> Section -> Fragment

import { useState, useEffect } from "../../imports/ImportReacts.jsx";
import { useCommon } from "../../imports/ImportHooks.jsx";
import { axios } from "../../imports/ImportLibs.jsx"
import { Loading } from "../../imports/ImportLayouts.jsx";
import { Div, Img, Br, Hr } from "../../imports/ImportComponents.jsx";
import { Card, Paper, Grid } from "../../imports/ImportMuis.jsx";
import { logo1 } from "../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const UserAppInfo = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    version: "",
    date: "",
    github: "",
    license: "",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/app/info`)
    .then(res => {
      setOBJECT(res.data.result || OBJECT_DEF);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId]);

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
      const cardFragment = (i) => (
        <Card className={"border radius p-0"} key={i}>
          <Grid container columnSpacing={2} rowSpacing={1} className={"fs-0-8rem"}>
            <Grid
              size={12}
              className={"d-between mt-5 p-10"}
              borderBottom={
                "1px solid #ddd"
              }
            >
              <Grid size={3} className={"d-left ms-2vw"}>
                version
              </Grid>
              <Grid size={9} className={"d-right me-2vw"}>
                {OBJECT.version}
              </Grid>
            </Grid>
            <Grid
              size={12}
              className={"d-between p-10"}
              borderBottom={
                "1px solid #ddd"
              }
            >
              <Grid size={3} className={"d-left ms-2vw"}>
                date
              </Grid>
              <Grid size={9} className={"d-right me-2vw"}>
                {OBJECT.date}
              </Grid>
            </Grid>
            <Grid
              size={12}
              className={"d-between p-10"}
              borderBottom={
                "1px solid #ddd"
              }
            >
              <Grid size={3} className={"d-left ms-2vw"}>
                github
              </Grid>
              <Grid size={9} className={"d-right fs-0-6rem me-2vw"}>
                {OBJECT.git}
              </Grid>
            </Grid>
            <Grid
              size={12}
              className={"d-between mb-5 p-10"}
            >
              <Grid size={3} className={"d-left ms-2vw"}>
                license
              </Grid>
              <Grid size={9} className={"d-right me-2vw"}>
                {OBJECT.license}
              </Grid>
            </Grid>
          </Grid>
        </Card>
      );
      return (
        LOADING ? <Loading /> : cardFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center radius border h-min80vh"}>
        <Grid container columnSpacing={1} rowSpacing={3}>
          <Grid size={12}>
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
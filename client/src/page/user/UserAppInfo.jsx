// UserAppInfo.jsx
// Node -> Section -> Fragment

import { React, useState, useEffect } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { axios } from "../../import/ImportLibs.jsx"
import { Loading } from "../../import/ImportLayouts.jsx";
import { Div, Img, Br30, Br20, Hr20, Br10 } from "../../import/ImportComponents.jsx";
import { Card, Paper, Grid } from "../../import/ImportMuis.jsx";
import { logo1 } from "../../import/ImportImages.jsx";

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
      <Div className={"d-center"}>
        <Img
          src={logo1}
          alt={"logo1"}
          className={"w-240 h-200"}
        />
      </Div>
    );
    // 7-2. card
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"d-column border radius p-0"} key={i}>
          <Grid container columnSpacing={2} className={"fs-0-8rem"}>
            <Br10 />
            <Grid size={12} className={"d-between p-20"}>
              <Grid size={3} className={"d-left upper fw-600"}>
                version
              </Grid>
              <Grid size={9} className={"d-right"}>
                {OBJECT.version}
              </Grid>
            </Grid>
            <Hr20 />
            <Grid size={12} className={"d-between p-20"}>
              <Grid size={3} className={"d-left upper fw-600"}>
                date
              </Grid>
              <Grid size={9} className={"d-right"}>
                {OBJECT.date}
              </Grid>
            </Grid>
            <Hr20 />
            <Grid size={12} className={"d-between p-20"}>
              <Grid size={3} className={"d-left upper fw-600"}>
                github
              </Grid>
              <Grid size={9} className={"d-right"}>
                {OBJECT.git}
              </Grid>
            </Grid>
            <Hr20 />
            <Grid size={12} className={"d-between p-20"}>
              <Grid size={3} className={"d-left upper fw-600"}>
                license
              </Grid>
              <Grid size={9} className={"d-right"}>
                {OBJECT.license}
              </Grid>
            </Grid>
            <Br10 />
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
        <Grid container columnSpacing={1}>
          <Grid size={12}>
            <Br20 />
            {imageSection()}
            <Br30 />
            {cardSection()}
            <Br30 />
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
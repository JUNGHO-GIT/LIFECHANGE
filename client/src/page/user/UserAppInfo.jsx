// UserAppInfo.jsx

import { React, useState, useEffect } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { axios } from "../../import/ImportLibs.jsx"
import { Loading } from "../../import/ImportLayouts.jsx";
import { Div, Img, Br50 } from "../../import/ImportComponents.jsx";
import { Card, Paper, Grid } from "../../import/ImportMuis.jsx";
import { logo1 } from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const UserAppInfo = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    URL_OBJECT, sessionId,
  } = useCommon();

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
  useEffect(() => {(async () => {
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
  })()}, [sessionId]);

  // 6. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. image
    const imageSection = () => (
      <Div className={"d-center"}>
        <Img src={logo1} alt={"logo1"} className={"w-240 h-200"} />
      </Div>
    );
    // 7-2. table
    const tableSection = () => {
      const tableFragment = (i) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <Grid container>
            <Grid item xs={12} className={"d-center border-top p-20"}>
              <Grid item xs={3} className={"d-left fs-0-9rem fw-500"}>
                version
              </Grid>
              <Grid item xs={9} className={"d-right fs-0-8rem fw-500"}>
                {OBJECT.version}
              </Grid>
            </Grid>
            <Grid item xs={12} className={"d-center border-top p-20"}>
              <Grid item xs={3} className={"d-left fs-0-9rem fw-500"}>
                date
              </Grid>
              <Grid item xs={9} className={"d-right fs-0-8rem fw-500"}>
                {OBJECT.date}
              </Grid>
            </Grid>
            <Grid item xs={12} className={"d-center border-top p-20"}>
              <Grid item xs={3} className={"d-left fs-0-9rem fw-500"}>
                github
              </Grid>
              <Grid item xs={9} className={"d-right fs-0-6rem fw-500"}>
                {OBJECT.git}
              </Grid>
            </Grid>
            <Grid item xs={12} className={"d-center border-top p-20"}>
              <Grid item xs={3} className={"d-left fs-0-9rem fw-500"}>
                license
              </Grid>
              <Grid item xs={9} className={"d-right fs-0-8rem fw-500"}>
                {OBJECT.license}
              </Grid>
            </Grid>
          </Grid>
        </Card>
      );
      return (
        LOADING ? <Loading /> : tableFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper d-column h-min80vh"}>
          {imageSection()}
          <Br50 />
          {tableSection()}
        </Div>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
    </>
  );
};
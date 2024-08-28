// Banner.jsx
// Node -> Section -> Fragment

import { Div } from "../../imports/ImportComponents.jsx";
import { Paper, Grid } from "../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Banner = () => {

  // 7. bannerNode ---------------------------------------------------------------------------------
  const bannerNode = () => {
    const bannerSection = (
      <Div className={"d-center"}>
      </Div>
    );
    return (
      <Paper className={"layout-wrapper p-sticky bottom-0vh radius border h-60"}>
        <Grid container>
          <Grid size={12}>
            {bannerSection}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {bannerNode()}
    </>
  );
};
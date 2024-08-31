// Banner.tsx
// Node -> Section -> Fragment

import { Paper, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const Banner = () => {

  // 7. bannerNode ---------------------------------------------------------------------------------
  const bannerNode = () => {
    const bannerSection = (
      null
    );
    return (
      <Paper className={"layout-wrapper p-sticky bottom-0vh radius border h-60"}>
        <Grid container columnSpacing={1} rowSpacing={2}>
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
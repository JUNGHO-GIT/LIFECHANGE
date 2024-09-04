// Banner.tsx

import { Paper, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const Banner = () => {

  // 7. bannerNode ---------------------------------------------------------------------------------
  const bannerNode = () => {
    return (
      <Paper className={"layout-wrapper border p-sticky bottom-0vh h-60 w-100vw"}>
        <Grid container spacing={2}>
          <Grid size={12}>
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
// Banner.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Paper, Card} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Banner = () => {

  // 1. bannerNode ---------------------------------------------------------------------------------
  const bannerNode = () => (
    <Paper className={"flex-wrapper p-sticky bottom-0 radius border shadow-none"}>
      <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
        {" "}
      </Card>
    </Paper>
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {bannerNode()}
    </>
  );
};
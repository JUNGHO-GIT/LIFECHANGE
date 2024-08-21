// Banner.jsx

import { React}from "../../import/ImportReacts.jsx";
import { Div } from "../../import/ImportComponents.jsx";
import { Paper, Card } from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Banner = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <Paper className={"flex-wrapper p-sticky bottom-0vh radius border shadow-none"}>
      <Card className={"block-wrapper d-row h-60 w-100p shadow-none"}>
        <Div className={"d-center"}>
        </Div>
      </Card>
    </Paper>
  );
};
// Ad.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {Div, Img} from "../../import/ImportComponents.jsx";
import {Paper, Card} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Ad = () => {

  // 6. default ------------------------------------------------------------------------------------
  const defaultNode = () => (
    <Div className={"d-center"}>
      ad
    </Div>
  );

  // 7. adNode -------------------------------------------------------------------------------------
  const adNode = () => (
    <Paper className={"flex-wrapper p-sticky bottom-8vh radius border shadow-none"}>
      <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
        {defaultNode()}
      </Card>
    </Paper>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {adNode()}
    </>
  );
};
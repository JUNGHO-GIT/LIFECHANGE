// Bottom.jsx

import {React}from "../../import/ImportReacts.jsx";
import {Navigation} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Bottom = () => {

  // 7. bottom ------------------------------------------------------------------------------------>
  const bottomNode = () => (
    <Paper className={"flex-wrapper p-sticky bottom-0 border-top"}>
      <Navigation />
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {bottomNode()}
    </>
  );
};
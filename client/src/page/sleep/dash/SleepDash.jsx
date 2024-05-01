// SleepDash.jsx

import React from "react";
import {SleepDashBar} from "./SleepDashBar.jsx";
import {SleepDashLine} from "./SleepDashLine.jsx";
import {SleepDashAvg} from "./SleepDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"d-block"}>
        {SleepDashBar()}
        {SleepDashLine()}
        {/* {SleepDashAvg()} */}
      </div>
    </React.Fragment>
  );
};
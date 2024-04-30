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
      <div className={"mb-10"}>
        {SleepDashBar()}
      </div>
      <div className={"mb-10"}>
        {SleepDashLine()}
      </div>
      <div>
        {SleepDashAvg()}
      </div>
    </React.Fragment>
  );
};
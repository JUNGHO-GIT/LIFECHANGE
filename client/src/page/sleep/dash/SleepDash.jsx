// SleepDash.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {SleepDashBar} from "./SleepDashBar.jsx";
import {SleepDashPie} from "./SleepDashPie.jsx";
import {SleepDashLine} from "./SleepDashLine.jsx";
import {SleepDashAvg} from "./SleepDashAvg.jsx";

// -------------------------------------------------------------------------------------------------
export const SleepDash = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {SleepDashBar()}
      {SleepDashPie()}
      {SleepDashLine()}
      {SleepDashAvg()}
    </>
  );
};
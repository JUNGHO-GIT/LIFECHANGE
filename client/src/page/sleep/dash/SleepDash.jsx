// SleepDash.jsx

import {React} from "../../../import/ImportReacts";
import {Header, NavBar} from "../../../import/ImportLayouts";
import {SleepDashBar} from "./SleepDashBar";
import {SleepDashLine} from "./SleepDashLine";
import {SleepDashAvg} from "./SleepDashAvg";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {Header()}
      {NavBar()}
      {SleepDashBar()}
      {SleepDashLine()}
      {SleepDashAvg()}
    </React.Fragment>
  );
};
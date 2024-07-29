// SleepChart.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {SleepChartBar} from "./SleepChartBar.jsx";
import {SleepChartPie} from "./SleepChartPie.jsx";
import {SleepChartLine} from "./SleepChartLine.jsx";
import {SleepChartAvg} from "./SleepChartAvg.jsx";
import {Br40} from "../../../import/ImportComponents.jsx";

// -------------------------------------------------------------------------------------------------
export const SleepChart = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {SleepChartBar()}
      {SleepChartPie()}
      {SleepChartLine()}
      {SleepChartAvg()}
      <Br40 />
    </>
  );
};
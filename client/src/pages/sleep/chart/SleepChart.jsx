// SleepChart.jsx
// Node -> Section -> Fragment

import { SleepChartBar } from "./SleepChartBar.jsx";
import { SleepChartPie } from "./SleepChartPie.jsx";
import { SleepChartLine } from "./SleepChartLine.jsx";
import { SleepChartAvg } from "./SleepChartAvg.jsx";

// -------------------------------------------------------------------------------------------------
export const SleepChart = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {SleepChartBar()}
      {SleepChartPie()}
      {SleepChartLine()}
      {SleepChartAvg()}
    </>
  );
};
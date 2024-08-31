// SleepChart.tsx
// Node -> Section -> Fragment

import { SleepChartBar } from "./SleepChartBar";
import { SleepChartPie } from "./SleepChartPie";
import { SleepChartLine } from "./SleepChartLine";
import { SleepChartAvg } from "./SleepChartAvg";

// -------------------------------------------------------------------------------------------------
export const SleepChart = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {/* {SleepChartBar()} */}
      {SleepChartPie()}
      {SleepChartLine()}
      {SleepChartAvg()}
    </>
  );
};
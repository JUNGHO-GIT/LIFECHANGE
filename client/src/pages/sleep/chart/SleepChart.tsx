// SleepChart.tsx

import { SleepChartPie } from "./SleepChartPie";
import { SleepChartLine } from "./SleepChartLine";
import { SleepChartAvg } from "./SleepChartAvg";

// -------------------------------------------------------------------------------------------------
export const SleepChart = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {SleepChartPie()}
      {SleepChartLine()}
      {SleepChartAvg()}
    </>
  );
};
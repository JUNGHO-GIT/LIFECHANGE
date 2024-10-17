// SleepChart.tsx

import { SleepChartPie } from "./SleepChartPie";
import { SleepChartLine } from "./SleepChartLine";
import { SleepChartAvg } from "./SleepChartAvg";

// -------------------------------------------------------------------------------------------------
export const SleepChart = () => (
  <>
    {SleepChartPie()}
    {SleepChartLine()}
    {SleepChartAvg()}
  </>
);
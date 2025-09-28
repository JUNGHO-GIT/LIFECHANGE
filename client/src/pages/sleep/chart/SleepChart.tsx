// SleepChart.tsx

import { memo } from "@importReacts";
import { SleepChartPie } from "./SleepChartPie";
import { SleepChartLine } from "./SleepChartLine";
import { SleepChartAvg } from "./SleepChartAvg";

// -------------------------------------------------------------------------------------------------
export const SleepChart = memo(() => {
  return (
    <>
      <SleepChartPie />
      <SleepChartLine />
      <SleepChartAvg />
    </>
  );
});
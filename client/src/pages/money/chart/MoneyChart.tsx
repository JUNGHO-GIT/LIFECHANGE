// MoneyChart.tsx

import { memo } from "@importReacts";
import { MoneyChartPie } from "./MoneyChartPie";
import { MoneyChartLine } from "./MoneyChartLine";
import { MoneyChartAvg } from "./MoneyChartAvg";

// -------------------------------------------------------------------------------------------------
export const MoneyChart = memo(() => {
  return (
    <>
      <MoneyChartPie />
      <MoneyChartLine />
      <MoneyChartAvg />
    </>
  );
});
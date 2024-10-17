// MoneyChart.tsx

import { MoneyChartPie } from "./MoneyChartPie";
import { MoneyChartLine } from "./MoneyChartLine";
import { MoneyChartAvg } from "./MoneyChartAvg";

// -------------------------------------------------------------------------------------------------
export const MoneyChart = () => (
  <>
    {MoneyChartPie()}
    {MoneyChartLine()}
    {MoneyChartAvg()}
  </>
);
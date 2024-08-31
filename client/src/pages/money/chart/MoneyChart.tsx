// MoneyChart.tsx
// Node -> Section -> Fragment

import { MoneyChartBar } from "./MoneyChartBar";
import { MoneyChartPie } from "./MoneyChartPie";
import { MoneyChartLine } from "./MoneyChartLine";
import { MoneyChartAvg } from "./MoneyChartAvg";

// -------------------------------------------------------------------------------------------------
export const MoneyChart = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {/* {MoneyChartBar()} */}
      {MoneyChartPie()}
      {MoneyChartLine()}
      {MoneyChartAvg()}
    </>
  );
};
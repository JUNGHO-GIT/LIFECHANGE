// MoneyChart.jsx
// Node -> Section -> Fragment

import { React } from "../../../imports/ImportReacts.jsx";
import { MoneyChartBar } from "./MoneyChartBar.jsx";
import { MoneyChartPie } from "./MoneyChartPie.jsx";
import { MoneyChartLine } from "./MoneyChartLine.jsx";
import { MoneyChartAvg } from "./MoneyChartAvg.jsx";
import { Br40 } from "../../../imports/ImportContainers.jsx";

// -------------------------------------------------------------------------------------------------
export const MoneyChart = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {MoneyChartBar()}
      {MoneyChartPie()}
      {MoneyChartLine()}
      {MoneyChartAvg()}
    </>
  );
};
// MoneyChart.jsx

import { React } from "../../../import/ImportReacts.jsx";
import { MoneyChartBar } from "./MoneyChartBar.jsx";
import { MoneyChartPie } from "./MoneyChartPie.jsx";
import { MoneyChartLine } from "./MoneyChartLine.jsx";
import { MoneyChartAvg } from "./MoneyChartAvg.jsx";
import { Br40 } from "../../../import/ImportComponents.jsx";

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
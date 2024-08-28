// ExerciseChart.jsx
// Node -> Section -> Fragment

import { ExerciseChartBar } from "./ExerciseChartBar.jsx";
import { ExerciseChartPie } from "./ExerciseChartPie.jsx";
import { ExerciseChartLine } from "./ExerciseChartLine.jsx";
import { ExerciseChartAvg } from "./ExerciseChartAvg.jsx";

// -------------------------------------------------------------------------------------------------
export const ExerciseChart = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {ExerciseChartBar()}
      {ExerciseChartPie()}
      {ExerciseChartLine()}
      {ExerciseChartAvg()}
    </>
  );
};

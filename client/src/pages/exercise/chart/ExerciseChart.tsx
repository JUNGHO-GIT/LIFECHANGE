// ExerciseChart.tsx

import { ExerciseChartBar } from "./ExerciseChartBar";
import { ExerciseChartPie } from "./ExerciseChartPie";
import { ExerciseChartLine } from "./ExerciseChartLine";
import { ExerciseChartAvg } from "./ExerciseChartAvg";

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

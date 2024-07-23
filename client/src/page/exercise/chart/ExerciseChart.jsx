// ExerciseChart.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {ExerciseChartBar} from "./ExerciseChartBar.jsx";
import {ExerciseChartPie} from "./ExerciseChartPie.jsx";
import {ExerciseChartLine} from "./ExerciseChartLine.jsx";
import {ExerciseChartAvg} from "./ExerciseChartAvg.jsx";
import {Br40} from "../../../import/ImportComponents.jsx";

// -------------------------------------------------------------------------------------------------
export const ExerciseChart = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {ExerciseChartBar()}
      {ExerciseChartPie()}
      {ExerciseChartLine()}
      {ExerciseChartAvg()}
      <Br40 />
    </>
  );
};

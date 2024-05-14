// ExerciseDash.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {ExerciseDashScatter} from "./ExerciseDashScatter.jsx";
import {ExerciseDashPie} from "./ExerciseDashPie.jsx";
import {ExerciseDashLine} from "./ExerciseDashLine.jsx";
import {ExerciseDashAvg} from "./ExerciseDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {ExerciseDashScatter()}
      {ExerciseDashPie()}
      {ExerciseDashLine()}
      {ExerciseDashAvg()}
    </>
  );
};

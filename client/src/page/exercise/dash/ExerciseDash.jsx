// ExerciseDash.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {ExerciseDashBar} from "./ExerciseDashBar.jsx";
import {ExerciseDashPie} from "./ExerciseDashPie.jsx";
import {ExerciseDashLine} from "./ExerciseDashLine.jsx";
import {ExerciseDashAvg} from "./ExerciseDashAvg.jsx";

// -------------------------------------------------------------------------------------------------
export const ExerciseDash = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {ExerciseDashBar()}
      {ExerciseDashPie()}
      {ExerciseDashLine()}
      {ExerciseDashAvg()}
    </>
  );
};

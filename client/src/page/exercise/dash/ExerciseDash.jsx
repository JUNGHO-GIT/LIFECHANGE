// ExerciseDash.jsx

import {React} from "../../../import/ImportReacts";
import {Header, NavBar} from "../../../import/ImportLayouts";
import {ExerciseDashScatter} from "./ExerciseDashScatter";
import {ExerciseDashPie} from "./ExerciseDashPie";
import {ExerciseDashLine} from "./ExerciseDashLine";
import {ExerciseDashAvg} from "./ExerciseDashAvg";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDash = () => {

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {Header()}
      {NavBar()}
      {ExerciseDashScatter()}
      {ExerciseDashPie()}
      {ExerciseDashLine()}
      {ExerciseDashAvg()}
    </React.Fragment>
  );
};

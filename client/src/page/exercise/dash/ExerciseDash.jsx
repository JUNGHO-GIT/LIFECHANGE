// ExerciseDash.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {Header, NavBar, Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {ExerciseDashScatter} from "./ExerciseDashScatter.jsx";
import {ExerciseDashPie} from "./ExerciseDashPie.jsx";
import {ExerciseDashLine} from "./ExerciseDashLine.jsx";
import {ExerciseDashAvg} from "./ExerciseDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {ExerciseDashScatter()}
      {ExerciseDashPie()}
      {ExerciseDashLine()}
      {ExerciseDashAvg()}
    </>
  );
};

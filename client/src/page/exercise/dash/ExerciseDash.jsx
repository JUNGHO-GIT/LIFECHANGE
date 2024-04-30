// ExerciseDash.jsx

import React from "react";
import {ExerciseDashScatter} from "./ExerciseDashScatter.jsx";
import {ExerciseDashPie} from "./ExerciseDashPie.jsx";
import {ExerciseDashLine} from "./ExerciseDashLine.jsx";
import {ExerciseDashAvg} from "./ExerciseDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"mb-10"}>
        {ExerciseDashScatter()}
      </div>
      <div className={"mb-10"}>
        {ExerciseDashPie()}
      </div>
      <div className={"mb-10"}>
        {ExerciseDashLine()}
      </div>
      <div>
        {ExerciseDashAvg()}
      </div>
    </React.Fragment>
  );
};

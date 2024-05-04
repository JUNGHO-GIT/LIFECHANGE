// ExerciseDash.jsx

import React from "react";
import {ExerciseDashScatter} from "./ExerciseDashScatter.jsx";
import {ExerciseDashPie} from "./ExerciseDashPie.jsx";
import {ExerciseDashLine} from "./ExerciseDashLine.jsx";
import {ExerciseDashAvg} from "./ExerciseDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDash = () => {

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {ExerciseDashScatter()}
      <br/>
      {ExerciseDashPie()}
      <br/>
      {ExerciseDashLine()}
      <br/>
      {ExerciseDashAvg()}
    </React.Fragment>
  );
};

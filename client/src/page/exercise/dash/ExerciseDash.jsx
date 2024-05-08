// ExerciseDash.jsx

import React from "react";
import {Header} from "page/architecture/Header";
import {NavBar} from "page/architecture/NavBar";
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

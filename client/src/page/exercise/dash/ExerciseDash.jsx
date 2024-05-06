// ExerciseDash.jsx

import React from "react";
import {Header} from "../../../layout/Header.jsx";
import {NavBar} from "../../../layout/NavBar.jsx";
import {ExerciseDashScatter} from "./ExerciseDashScatter.jsx";
import {ExerciseDashPie} from "./ExerciseDashPie.jsx";
import {ExerciseDashLine} from "./ExerciseDashLine.jsx";
import {ExerciseDashAvg} from "./ExerciseDashAvg.jsx";

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

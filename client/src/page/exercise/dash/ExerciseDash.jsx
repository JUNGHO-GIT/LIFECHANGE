// ExerciseDash.jsx

import React from "react";
import {ExerciseDashBarToday} from "./ExerciseDashBarToday.jsx";
import {ExerciseDashScatterWeek} from "./ExerciseDashScatterWeek.jsx";
import {ExerciseDashScatterMonth} from "./ExerciseDashScatterMonth.jsx";
import {ExerciseDashPieWeek} from "./ExerciseDashPieWeek.jsx";
import {ExerciseDashPieMonth} from "./ExerciseDashPieMonth.jsx";
import {ExerciseDashLineWeek} from "./ExerciseDashLineWeek.jsx";
import {ExerciseDashLineMonth} from "./ExerciseDashLineMonth.jsx";
import {ExerciseDashAvgWeek} from "./ExerciseDashAvgWeek.jsx";
import {ExerciseDashAvgMonth} from "./ExerciseDashAvgMonth.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {ExerciseDashBarToday()}
      <br />
      {ExerciseDashScatterWeek()}
      <br />
      {ExerciseDashScatterMonth()}
      <br />
      {ExerciseDashPieWeek()}
      <br />
      {ExerciseDashPieMonth()}
      <br />
      {ExerciseDashLineWeek()}
      <br />
      {ExerciseDashLineMonth()}
      <br />
      {ExerciseDashAvgWeek()}
      <br />
      {ExerciseDashAvgMonth()}
      <br />
    </React.Fragment>
  );
};

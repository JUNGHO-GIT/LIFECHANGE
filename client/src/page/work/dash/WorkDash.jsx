// WorkDash.jsx

import React from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {DashScatterMonth} from "./DashScatterMonth.jsx";
import {DashPieWeek} from "./DashPieWeek.jsx";
import {DashLineWeek} from "./DashLineWeek.jsx";
import {DashAvgWeek} from "./DashAvgWeek.jsx";

// ------------------------------------------------------------------------------------------------>
export const WorkDash = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeDash, set:setActiveDash} = useStorage(
    `activeDash(${PATH})`, "scatter"
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container"}>
        <div className={"container-wrapper mb-10"}>
          <div className={"btn-group"}>
            <p
              className={`btn ${activeDash === "scatter" ? "btn-primary" : "btn-secondary"} me-20`}
              onClick={() => setActiveDash("scatter")}
            >
              월간 몸무게
            </p>
            <p
              className={`btn ${activeDash === "pie" ? "btn-primary" : "btn-secondary"} me-20`}
              onClick={() => setActiveDash("pie")}
            >
              주간 상위 5개 부위 / 운동
            </p>
            <p
              className={`btn ${activeDash === "line" ? "btn-primary" : "btn-secondary"} me-20`}
              onClick={() => setActiveDash("line")}
            >
              주간 웨이트 / 유산소
            </p>
            <p
              className={`btn ${activeDash === "avg" ? "btn-primary" : "btn-secondary"} me-20`}
              onClick={() => setActiveDash("avg")}
            >
              주간/월간 평균 운동
            </p>
          </div>
        </div>
        <div className={"container-wrapper mb-10"}>
          <div className={`${activeDash === "scatter" ? "" : "d-none"}`}>
            <h5>월간 몸무게</h5>
            {DashScatterMonth()}
          </div>
          <div className={`${activeDash === "pie" ? "" : "d-none"}`}>
            <h5>상위 5개 부위 / 운동</h5>
            {DashPieWeek()}
          </div>
          <div className={`${activeDash === "line" ? "" : "d-none"}`}>
            <h5>주간 웨이트 / 유산소</h5>
            {DashLineWeek()}
          </div>
          <div className={`${activeDash === "avg" ? "" : "d-none"}`}>
            <h5>주간/월간 평균 운동</h5>
            {DashAvgWeek()}
          </div>
        </div>
      </div>
    </div>
  );
};

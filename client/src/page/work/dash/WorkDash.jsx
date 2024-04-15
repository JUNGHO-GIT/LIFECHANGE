// WorkDash.jsx

import React from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {DashScatterWeek} from "./DashScatterWeek.jsx";
import {DashScatterMonth} from "./DashScatterMonth.jsx";
import {DashPieWeek} from "./DashPieWeek.jsx";
import {DashPieMonth} from "./DashPieMonth.jsx";
import {DashLineWeek} from "./DashLineWeek.jsx";
import {DashLineMonth} from "./DashLineMonth.jsx";
import {DashAvgWeek} from "./DashAvgWeek.jsx";
import {DashAvgMonth} from "./DashAvgMonth.jsx";

// ------------------------------------------------------------------------------------------------>
export const WorkDash = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeDash, set:setActiveDash} = useStorage(
    `activeDash (${PATH})`, "scatter-month"
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container"}>
        <div className={"container-wrapper mb-10"}>
          <div className={"btn-group"}>
            <p className={`btn ${activeDash === "scatter-week" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("scatter-week")}>
              주간 몸무게 목표 / 실제
            </p>
            <p className={`btn ${activeDash === "scatter-month" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("scatter-month")}>
              월간 몸무게 목표 / 실제
            </p>
          </div>
          <br />
          <div className={"btn-group"}>
            <p className={`btn ${activeDash === "pie-week" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("pie-week")}>
              주간 상위 5개 부위 / 운동
            </p>
            <p className={`btn ${activeDash === "pie-month" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("pie-month")}>
              월간 상위 5개 부위 / 운동
            </p>
          </div>
          <br />
          <div className={"btn-group"}>
            <p className={`btn ${activeDash === "line-week" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("line-week")}>
              주간 총볼륨 / 유산소시간
            </p>
            <p className={`btn ${activeDash === "line-month" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("line-month")}>
              월간 총볼륨 / 유산소시간
            </p>
          </div>
          <br />
          <div className={"btn-group"}>
            <p className={`btn ${activeDash === "avg-week" ? "btn-primary" : "btn-secondary"} me-20`}
              onClick={() => setActiveDash("avg-week")}>
              주간 총볼륨 / 유산소시간 평균
            </p>
            <p className={`btn ${activeDash === "avg-month" ? "btn-primary" : "btn-secondary"} me-20`}
              onClick={() => setActiveDash("avg-month")}>
              월간 총볼륨 / 유산소시간 평균
            </p>
          </div>
        </div>
        <div className={"container-wrapper mb-10"}>
          <div className={`${activeDash === "scatter-week" ? "" : "d-none"}`}>
            <h5>주간 몸무게 목표 / 실제</h5>
            {DashScatterWeek()}
          </div>
          <div className={`${activeDash === "scatter-month" ? "" : "d-none"}`}>
            <h5>월간 몸무게 목표 / 실제</h5>
            {DashScatterMonth()}
          </div>
          <div className={`${activeDash === "pie-week" ? "" : "d-none"}`}>
            <h5>주간 상위 5개 부위 / 운동</h5>
            {DashPieWeek()}
          </div>
          <div className={`${activeDash === "pie-month" ? "" : "d-none"}`}>
            <h5>월간 상위 5개 부위 / 운동</h5>
            {DashPieMonth()}
          </div>
          <div className={`${activeDash === "line-week" ? "" : "d-none"}`}>
            <h5>주간 총볼륨 / 유산소시간</h5>
            {DashLineWeek()}
          </div>
          <div className={`${activeDash === "line-month" ? "" : "d-none"}`}>
            <h5>월간 총볼륨 / 유산소시간</h5>
            {DashLineMonth()}
          </div>
          <div className={`${activeDash === "avg-week" ? "" : "d-none"}`}>
            <h5>주간 총볼륨 / 유산소시간 평균</h5>
            {DashAvgWeek()}
          </div>
          <div className={`${activeDash === "avg-month" ? "" : "d-none"}`}>
            <h5>월간 총볼륨 / 유산소시간 평균</h5>
            {DashAvgMonth()}
          </div>
        </div>
      </div>
    </div>
  );
};

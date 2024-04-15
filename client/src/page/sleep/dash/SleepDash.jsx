// SleepDash.jsx

import React from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {DashBarToday} from "./DashBarToday.jsx";
import {DashLineWeek} from "./DashLineWeek.jsx";
import {DashAvgWeek} from "./DashAvgWeek.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeDash, set:setActiveDash} = useStorage(
    `activeDash(${PATH})`, "bar"
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container"}>
        <div className={"container-wrapper mb-10"}>
          <div className={"btn-group"}>
            <p
              className={`btn ${activeDash === "bar" ? "btn-primary" : "btn-secondary"} me-20`}
              onClick={() => setActiveDash("bar")}
            >
              오늘 목표/실제 수면 데이터
            </p>
            <p
              className={`btn ${activeDash === "line" ? "btn-primary" : "btn-secondary"} me-20`}
              onClick={() => setActiveDash("line")}
            >
              주간 수면 데이터
            </p>
            <p
              className={`btn ${activeDash === "avg" ? "btn-primary" : "btn-secondary"} me-20`}
              onClick={() => setActiveDash("avg")}
            >
              주간/월간 평균 수면 데이터
            </p>
          </div>
        </div>
        <div className={"container-wrapper mb-10"}>
          <div className={`${activeDash === "bar" ? "" : "d-none"}`}>
            <h5>오늘 목표/실제 수면 데이터</h5>
            {DashBarToday()}
          </div>
          <div className={`${activeDash === "line" ? "" : "d-none"}`}>
            <h5>주간 수면 데이터</h5>
            {DashLineWeek()}
          </div>
          <div className={`${activeDash === "avg" ? "" : "d-none"}`}>
            <h5>주간/월간 평균 수면 데이터</h5>
            {DashAvgWeek()}
          </div>
        </div>
      </div>
    </div>
  );
};

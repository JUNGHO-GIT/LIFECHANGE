// MoneyDash.jsx

import React from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {MoneyDashBar} from "./MoneyDashBar.jsx";
import {MoneyDashPie} from "./MoneyDashPie.jsx";
import {MoneyDashLine} from "./MoneyDashLine.jsx";
import {MoneyDashAvg} from "./MoneyDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDash = () => {

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
              오늘 목표/실제 수입/지출
            </p>
            <p
              className={`btn ${activeDash === "pie" ? "btn-primary" : "btn-secondary"} me-20`}
              onClick={() => setActiveDash("pie")}
            >
              오늘 수입/지출
            </p>
            <p
              className={`btn ${activeDash === "line" ? "btn-primary" : "btn-secondary"} me-20`}
              onClick={() => setActiveDash("line")}
            >
              주간 수입/지출
            </p>
            <p
              className={`btn ${activeDash === "avg" ? "btn-primary" : "btn-secondary"} me-20`}
              onClick={() => setActiveDash("avg")}
            >
              주간/월간 평균 수입/지출
            </p>
          </div>
        </div>
        <div className={"container-wrapper mb-10"}>
          <div className={`${activeDash === "bar" ? "" : "d-none"}`}>
            <h5>오늘 목표/실제 수입/지출</h5>
            {MoneyDashBar()}
          </div>
          <div className={`${activeDash === "pie" ? "" : "d-none"}`}>
            <h5>오늘 수입/지출</h5>
            {MoneyDashPie()}
          </div>
          <div className={`${activeDash === "line" ? "" : "d-none"}`}>
            <h5>주간 수입/지출</h5>
            {MoneyDashLine()}
          </div>
          <div className={`${activeDash === "avg" ? "" : "d-none"}`}>
            <h5>주간/월간 평균 수입/지출</h5>
            {MoneyDashAvg()}
          </div>
        </div>
      </div>
    </div>
  );
};
// Dash.jsx

import React from "react";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import {useNavigate} from "react-router-dom";
import {DayPicker} from "react-day-picker";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {useDeveloperMode} from "../../assets/hooks/useDeveloperMode.jsx";
import {Button, ButtonGroup, Table, Form} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const Dash = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Dash";
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:dashboardDay, set:setDashDay} = useStorage(
    "dashboardDay(DAY)", undefined
  );

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDayClick = (day) => {
    const clickDate = moment(day).format("YYYY-MM-DD");
    setDashDay(day);
  };

  // 4-1. view ------------------------------------------------------------------------------------>
  const viewDashDay = () => {
    return (
      <DayPicker
        mode="single"
        showOutsideDays
        selected={dashboardDay}
        month={dashboardDay}
        locale={ko}
        weekStartsOn={1}
        onDayClick={flowDayClick}
        onMonthChange={month => setDashDay(month)}
        modifiersClassNames={{
          selected: "selected",
          disabled: "disabled",
          outside: "outside",
          inside: "inside",
        }}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const btnToday = () => {
    return (
      <Button variant={"success"} size={"sm"} className={"me-2"} onClick={() => (
        setDashDay(koreanDate),
        localStorage.removeItem("dashboardDay(DAY)")
      )}>
        Today
      </Button>
    );
  };
  const btnReset = () => {
    return (
      <Button variant={"primary"} size={"sm"} className={"me-2"} onClick={() => (
        setDashDay(koreanDate),
        localStorage.removeItem("dashboardDay(DAY)")
      )}>
        Reset
      </Button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-fluid"}>
        <div className="row mb-20">
          <div className={"col-12"}>
            <div className="container-wrapper d-left">
              <div className="row d-center mt-5">
                <div className={"col-12"}>
                  <h1 className="mb-3 fw-7">{TITLE}</h1>
                  <h2 className="mb-3 fw-7">일별로 조회</h2>
                </div>
              </div>
              <div className={"row d-center mt-3"}>
                <div className="col-md-6 col-12 d-center">
                  {viewDashDay()}
                </div>
              </div>
              <div className="row mb-20">
                <div className="col-12 d-center">
                  {btnToday()}
                  {btnReset()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className={"col-6"}>
            <div className={"container-wrapper"}>
              <div className="row d-center mt-5">
                <div className={"col-12"}>
                  <h1 className="mb-3 fw-7">{TITLE}</h1>
                  <h2 className="mb-3 fw-7">일별로 조회</h2>
                </div>
              </div>
              <div className={"row d-center mt-3"}>
                <div className="col-md-6 col-12 d-center">
                  {viewDashDay()}
                </div>
              </div>
              <div className="row mb-20">
                <div className="col-12 d-center">
                  {btnToday()}
                  {btnReset()}
                </div>
              </div>
            </div>
          </div>
          <div className={"col-6"}>
            <div className={"container-wrapper"}>
              <div className="row d-center mt-5">
                <div className={"col-12"}>
                  <h1 className="mb-3 fw-7">{TITLE}</h1>
                  <h2 className="mb-3 fw-7">일별로 조회</h2>
                </div>
              </div>
              <div className={"row d-center mt-3"}>
                <div className="col-md-6 col-12 d-center">
                  {viewDashDay()}
                </div>
              </div>
              <div className="row mb-20">
                <div className="col-12 d-center">
                  {btnToday()}
                  {btnReset()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
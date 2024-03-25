// DashList.tsx

import React from "react";
import {useNavigate} from "react-router-dom";
import {DayPicker} from "react-day-picker";
import {useStorage} from "../../assets/ts/useStorage";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const DashList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Dash List";
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:dashboardDay, setVal:setDashDay} = useStorage<Date | undefined>(
    "dashboardDay(DAY)", undefined
  );

  // 2-2. useState -------------------------------------------------------------------------------->

  // 2-3. useEffect ------------------------------------------------------------------------------->

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDayClick = (day:Date) => {
    const clickDate = moment(day).format("YYYY-MM-DD").toString();
    setDashDay(day);
    navParam(`/calendarDetail`, {
      state: {
        user_id: user_id,
        calendar_date: clickDate,
      },
    });
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

  // 5. table ------------------------------------------------------------------------------------->

  // 6. button ------------------------------------------------------------------------------------>
  const buttonDashToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setDashDay(koreanDate);
        localStorage.removeItem("dashboardDay(DAY)");
      }}>
        Today
      </button>
    );
  };
  const buttonDashReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setDashDay(koreanDate);
        localStorage.removeItem("dashboardDay(DAY)");
      }}>
        Reset
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="root-wrapper">
      <div className="container-fluid">
        <div className="row  mb-20">
          <div className="col-12">
            <div className="container-wrapper d-left">
              <div className="row d-center mt-5">
                <div className="col-12">
                  <h1 className="mb-3 fw-7">{TITLE}</h1>
                  <h2 className="mb-3 fw-7">일별로 조회</h2>
                </div>
              </div>
              <div className="row d-center mt-3">
                <div className="col-md-6 col-12 d-center">
                  {viewDashDay()}
                </div>
              </div>
              <div className="row mb-20">
                <div className="col-12 d-center">
                  {buttonDashToday()}
                  {buttonDashReset()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="container-wrapper">
              <div className="row d-center mt-5">
                <div className="col-12">
                  <h1 className="mb-3 fw-7">{TITLE}</h1>
                  <h2 className="mb-3 fw-7">일별로 조회</h2>
                </div>
              </div>
              <div className="row d-center mt-3">
                <div className="col-md-6 col-12 d-center">
                  {viewDashDay()}
                </div>
              </div>
              <div className="row mb-20">
                <div className="col-12 d-center">
                  {buttonDashToday()}
                  {buttonDashReset()}
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="container-wrapper">
              <div className="row d-center mt-5">
                <div className="col-12">
                  <h1 className="mb-3 fw-7">{TITLE}</h1>
                  <h2 className="mb-3 fw-7">일별로 조회</h2>
                </div>
              </div>
              <div className="row d-center mt-3">
                <div className="col-md-6 col-12 d-center">
                  {viewDashDay()}
                </div>
              </div>
              <div className="row mb-20">
                <div className="col-12 d-center">
                  {buttonDashToday()}
                  {buttonDashReset()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
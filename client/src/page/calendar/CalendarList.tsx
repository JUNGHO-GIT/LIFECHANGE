// CalendarList.tsx

import React from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DayPicker} from "react-day-picker";
import {useStorage} from "../../assets/ts/useStorage";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const CalendarList = () => {
  const TITLE = "Calendar List";
  const URL_CALENDAR = process.env.REACT_APP_URL_CALENDAR;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:calendarDay, setVal:setCalendarDay} = useStorage<Date | undefined>(
    "calendarDay(DAY)", undefined
  );

  // 2-2. useState -------------------------------------------------------------------------------->

  // 2-3. useEffect ------------------------------------------------------------------------------->

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDayClick = (day:Date) => {
    const clickDate = moment(day).format("YYYY-MM-DD").toString();
    setCalendarDay(day);
    navParam(`/calendarDetail`, {
      state: {
        user_id: user_id,
        calendar_date: clickDate,
      },
    });
  };

  // 4-1. view ------------------------------------------------------------------------------------>
  const viewCalendarDay = () => {
    return (
      <DayPicker
        mode="single"
        showOutsideDays
        selected={calendarDay}
        month={calendarDay}
        locale={ko}
        weekStartsOn={1}
        onDayClick={flowDayClick}
        onMonthChange={month => setCalendarDay(month)}
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
  const buttonCalendarToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setCalendarDay(koreanDate);
        localStorage.removeItem("calendarDay(DAY)");
      }}>
        Today
      </button>
    );
  };
  const buttonCalendarReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setCalendarDay(koreanDate);
        localStorage.removeItem("calendarDay(DAY)");
      }}>
        Reset
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
          <h2 className="mb-3 fw-7">일별로 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-md-6 col-12 d-center">
          {viewCalendarDay()}
        </div>
      </div>
      <div className="row mb-20">
        <div className="col-12 d-center">
          {buttonCalendarToday()}
          {buttonCalendarReset()}
        </div>
        </div>
      </div>
    </div>
  );
};
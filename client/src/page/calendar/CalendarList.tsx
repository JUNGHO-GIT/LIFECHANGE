// CalendarList.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { DayClickEventHandler, DayPicker } from "react-day-picker";
import { useStorage } from "../../assets/ts/useStorage";
import { ko } from "date-fns/locale";
import { parseISO } from "date-fns";
import moment from "moment-timezone";
import axios from "axios";

// 1. main ---------------------------------------------------------------------------------------->
export const CalendarList = () => {

  // title
  const TITLE = "Calendar List";
  // url
  const URL_CALENDAR = process.env.REACT_APP_URL_CALENDAR;
  // date
  const koreanDate = new Date (
    moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString()
  );
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state 1
  const {val:calendarDay, setVal:setCalendarDay} = useStorage<Date | undefined> (
    "calendarDay(DAY)", undefined
  );

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDayClick = (day:Date) => {
    setCalendarDay(day);
    navParam(`/calendarDetail`, {
      state: {
        user_id: user_id,
        calendar_date: day,
      },
    });
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewDay = () => {
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

  // 6. button ------------------------------------------------------------------------------------>
  const buttonCalendarToday = () => {
    return (
      <button
        type="button"
        className="btn btn-sm btn-success me-2"
        onClick={() => {
          setCalendarDay(koreanDate);
        }}>
        Today
      </button>
    );
  };
  const buttonCalendarReset = () => {
    return (
      <button
        type="button"
        className="btn btn-sm btn-primary me-2"
        onClick={() => {
          setCalendarDay(koreanDate);
        }}>
        Reset
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
          <h2 className="mb-3 fw-9">일별로 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-md-6 col-12 d-center">
          {viewDay()}
        </div>
      </div>
      <div className="row mb-20">
        <div className="col-12 d-center">
          {buttonCalendarToday()}
          {buttonCalendarReset()}
        </div>
      </div>
    </div>
  );
};
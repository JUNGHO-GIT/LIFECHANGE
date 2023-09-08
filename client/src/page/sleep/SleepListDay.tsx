// SleepListDay.tsx
import React, { useState } from "react";
import {
  DayClickEventHandler,
  DateRange,
  DayPicker,
  MonthChangeEventHandler,
  WeekNumberClickEventHandler,
} from "react-day-picker";
import { addMonths, isSameDay, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const SleepListDay = () => {
  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());

  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | undefined>(today.getDate());

  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    if (day) {
      setSelectedDay(day.getDate());
      setSelectedMonth(day.getMonth());
      setSelectedYear(day.getFullYear());
    }
    else {
      setSelectedDay(undefined);
    }
  };

  const handleResetClick = () => {
    setSelectedDay(undefined);
  };

  const selectedInfo = () => {
    if (selectedDay !== undefined) {
      return (
        <div>
          <hr />
          <span>{`${selectedYear}`}-</span>
          <span>{`${selectedMonth + 1}`}-</span>
          <span>{`${selectedDay}`}</span>
          <hr />
        </div>
      );
    }
    else {
      return (
        <div>
          <hr />
          <span>선택된 날짜가 없습니다.</span>
          <hr />
        </div>
      );
    }
  };

  const footer = () => {
    return (
      <div>
        <p>{selectedInfo()}</p>
        <button
          className="btn btn-success me-2"
          onClick={() => {
            setSelectedMonth(today.getMonth());
            setSelectedYear(today.getFullYear());
            setSelectedDay(today.getDate());
          }}
        >
          Today
        </button>
        <button className="btn btn-primary me-2" onClick={handleResetClick}>
          Reset
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <DayPicker
            mode="single"
            showOutsideDays
            selected={new Date(selectedYear, selectedMonth, selectedDay)}
            month={new Date(selectedYear, selectedMonth)}
            locale={ko}
            weekStartsOn={1}
            onDayClick={handleDayClick}
            onMonthChange={(date) => {
              setSelectedMonth(date.getMonth());
              setSelectedYear(date.getFullYear());
            }}
            modifiersClassNames={{
              today: "today",
              selected: "selected",
              disabled: "disabled",
              outside: "outside",
              inside: "inside",
            }}
            footer={footer()}
          />
        </div>
      </div>
    </div>
  );
};
// SleepListDay.tsx
import React, { useState, useEffect } from "react";
import { DayClickEventHandler, DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const SleepListDay = () => {

  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const [resultValue, setResultValue] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | undefined>(today.getDate());

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    if (selectedYear && selectedMonth !== undefined && selectedDay) {
      setResultValue(`${selectedYear}-${selectedMonth + 1}-${selectedDay}`);
    }
    else {
      setResultValue("선택된 날짜가 없습니다.");
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  // ---------------------------------------------------------------------------------------------->
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

  // ---------------------------------------------------------------------------------------------->
  const buttonSleepToday = () => {
    return (
      <button className="btn btn-success me-2" onClick={() => {
        setSelectedMonth(today.getMonth());
        setSelectedYear(today.getFullYear());
        setSelectedDay(today.getDate());
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setSelectedDay(undefined);
      }}>
        Reset
      </button>
    );
  };
  const footer = () => {
    return (
      <div>
        <hr />
        <p>{resultValue}</p>
        <hr />
        {buttonSleepToday()}
        {buttonSleepReset()}
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-center">
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

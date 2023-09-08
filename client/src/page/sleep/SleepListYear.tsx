// SleepListYear.tsx
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
export const SleepListYear = () => {

  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const [returnValue, setReturnValue] = useState<any>();

  const [selectedYear, setSelectedYear] = useState<Date | undefined>(today);

  const handleYearChange: MonthChangeEventHandler = (day) => {
    if (day) {
      const yearDate = new Date(day.getFullYear(), 0, 1);
      const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
      const nextMonth = differenceInDays(new Date(day.getFullYear() + 1, 0, 1), monthDate) / 30;
      const prevMonth = differenceInDays(monthDate, yearDate) / 30;

      if (nextMonth > prevMonth) {
        setSelectedYear(new Date(day.getFullYear() + 1, 0, 1));
      }
      else {
        setSelectedYear(new Date(day.getFullYear(), 0, 1));
      }
    }
    else {
      setSelectedYear(undefined);
    }
  };
  const selectedInfo = () => {
    if (selectedYear) {
      setReturnValue(`${selectedYear.getFullYear()}`);
      return (
        <div>
          <hr />
          <span>{`${selectedYear.getFullYear()}`}</span>
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
        <button className="btn btn-success me-2" onClick={() => {
          setSelectedYear(today);
        }}>
          Today
        </button>
        <button className="btn btn-primary me-2" onClick={() => {
          setSelectedYear(today);
        }}>
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
            mode="default"
            selected={selectedYear}
            showOutsideDays
            locale={ko}
            weekStartsOn={1}
            month={selectedYear}
            onMonthChange={handleYearChange}
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


// SleepListMonth.tsx
import React, { useState, useEffect } from "react";
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
export const SleepListMonth = () => {
  const today = new Date(
    moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString()
  );
  const [resultValue, setResultValue] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(today);

  useEffect(() => {
    if (selectedMonth) {
      setResultValue(
        `${selectedMonth.getFullYear()}-${selectedMonth.getMonth() + 1}`
      );
    } else {
      setResultValue("선택된 날짜가 없습니다.");
    }
  }, [selectedMonth]);

  const handleMonthChange: MonthChangeEventHandler = (day) => {
    if (day) {
      const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
      setSelectedMonth(monthDate);
    } else {
      setSelectedMonth(undefined);
    }
  };
  const footer = () => {
    return (
      <div>
        <hr />
        <p>{resultValue}</p>
        <hr />
        <button
          className="btn btn-success me-2"
          onClick={() => {
            setSelectedMonth(today);
          }}
        >
          Today
        </button>
        <button
          className="btn btn-primary me-2"
          onClick={() => setSelectedMonth(undefined)}
        >
          Reset
        </button>
      </div>
    );
  };
  return (
    <div className="container">
      <div className="row d-center">
        <div className="col-12">
          <DayPicker
            mode="default"
            selected={selectedMonth}
            showOutsideDays
            locale={ko}
            weekStartsOn={1}
            month={selectedMonth}
            onMonthChange={handleMonthChange}
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

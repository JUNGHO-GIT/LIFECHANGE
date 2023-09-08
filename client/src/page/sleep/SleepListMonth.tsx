// SleepListMonth.tsx
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
export const SleepListMonth = () => {

  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const [returnValue, setReturnValue] = useState<any>();
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(today);

  const handleMonthChange: MonthChangeEventHandler = (day) => {
    if (day) {
      const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
      setSelectedMonth(monthDate);
    }
    else {
      setSelectedMonth(undefined);
    }
  };

  const selectedInfo = () => {
    if (selectedMonth) {
      setReturnValue(`${selectedMonth.getFullYear()}-${selectedMonth.getMonth() + 1}`);
      return (
        <div>
          <hr />
          <span>{`${selectedMonth.getFullYear()}-${selectedMonth.getMonth() + 1}`}</span>
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
            setSelectedMonth(today);
          }}
        >
          Today
        </button>
        <button className="btn btn-primary me-2" onClick={() => setSelectedMonth(undefined)}>
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
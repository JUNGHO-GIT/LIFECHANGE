// SleepListYear.tsx
import React, { useState, useEffect } from "react";
import { DayPicker, MonthChangeEventHandler} from "react-day-picker";
import { differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const SleepListYear = () => {

  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const [resultValue, setResultValue] = useState<any>();
  const [selectedYear, setSelectedYear] = useState<Date | undefined>(today);

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    if (selectedYear) {
      setResultValue(`${selectedYear.getFullYear()}`);
    }
    else {
      setResultValue("선택된 날짜가 없습니다.");
    }
  }, [selectedYear]);

  // ---------------------------------------------------------------------------------------------->
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

  // ---------------------------------------------------------------------------------------------->
  const buttonSleepToday = () => {
    return (
      <button className="btn btn-success me-2" onClick={() => {
        setSelectedYear(today);
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setSelectedYear(undefined);
      }}>
        Reset
      </button>
    );
  };
  const footer = () => {
    return (
      <div>
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

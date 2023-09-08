// SleepListWeek.tsx
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
export const SleepListWeek = () => {
  const today = new Date(
    moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString()
  );
  const [resultValue, setResultValue] = useState<string>("");

  const [range, setRange] = useState<DateRange | undefined>();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);

  useEffect(() => {
    if (range?.from && range?.to) {
      setResultValue(
        `${range.from.getFullYear()}-${
          range.from.getMonth() + 1
        }-${range.from.getDate()} ~ ${range.to.getFullYear()}-${
          range.to.getMonth() + 1
        }-${range.to.getDate()}`
      );
    } else {
      setResultValue("선택된 날짜가 없습니다.");
    }
  }, [range]);

  const handleDayClick = (selectedDate: Date) => {
    const startOfWeek = moment(selectedDate).startOf("isoWeek").toDate();
    const endOfWeek = moment(selectedDate).endOf("isoWeek").toDate();
    setRange({ from: startOfWeek, to: endOfWeek });
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
            setCurrentMonth(today);
            setRange(undefined);
          }}
        >
          Today
        </button>
        <button
          className="btn btn-primary me-2"
          onClick={() => {
            setCurrentMonth(today);
            setRange(undefined);
          }}
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
            mode="range"
            showOutsideDays
            selected={range}
            month={currentMonth}
            onDayClick={handleDayClick}
            locale={ko}
            weekStartsOn={1}
            onMonthChange={(date) => {
              setCurrentMonth(date);
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

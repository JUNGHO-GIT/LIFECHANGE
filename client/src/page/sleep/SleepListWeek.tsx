// SleepListWeek.tsx
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
export const SleepListWeek = () => {
  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const [range, setRange] = useState<DateRange | undefined>();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);

  const handleDayClick = (selectedDate: Date) => {
    const startOfWeek = moment(selectedDate).startOf("isoWeek").toDate();
    const endOfWeek = moment(selectedDate).endOf("isoWeek").toDate();
    setRange({ from: startOfWeek, to: endOfWeek });
  };
  const selectedInfo = () => {
    if (range?.from && range?.to) {
      return (
        <div>
          <hr />
          <span>{`${range.from.getFullYear()}`}-</span>
          <span>{`${range.from.getMonth() + 1}`}-</span>
          <span>{`${range.from.getDate()}`}</span>
          <span> ~ </span>
          <span>{`${range.to.getFullYear()}`}-</span>
          <span>{`${range.to.getMonth() + 1}`}-</span>
          <span>{`${range.to.getDate()}`}</span>
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
            setCurrentMonth(today);
            setRange(undefined);
          }}
        >
          Today
        </button>
        <button className="btn btn-success me-2" onClick={() => {
          setCurrentMonth(today);
          setRange(undefined);
        }}>
          Today
        </button>
      </div>
    );
  };
  return (
    <div className="container">
      <div className="row">
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
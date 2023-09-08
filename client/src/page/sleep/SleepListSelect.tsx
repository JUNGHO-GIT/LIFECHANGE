// SleepListSelect.tsx
import React, { useState, useEffect } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const SleepListSelect = () => {

  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const [resultValue, setResultValue] = useState<string>("");
  const [selectedStartYear, setSelectedStartYear] = useState<number>();
  const [selectedStartMonth, setSelectedStartMonth] = useState<number>();
  const [selectedStartDay, setSelectedStartDay] = useState<number>();
  const [selectedEndYear, setSelectedEndYear] = useState<number>();
  const [selectedEndMonth, setSelectedEndMonth] = useState<number>();
  const [selectedEndDay, setSelectedEndDay] = useState<number>();
  const [range, setRange] = useState<DateRange | undefined>();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    if (
      selectedStartYear && selectedStartMonth && selectedStartDay &&
      selectedEndYear && selectedEndMonth && selectedEndDay
    ) {
      setResultValue (`
        ${selectedStartYear}-${selectedStartMonth}-${selectedStartDay} ~ ${selectedEndYear}-${selectedEndMonth}-${selectedEndDay}
      `);
    }
    else {
      setResultValue("선택된 날짜가 없습니다.");
    }
  }, [
    selectedStartYear, selectedStartMonth, selectedStartDay,
    selectedEndYear, selectedEndMonth, selectedEndDay,
  ]);

  // ---------------------------------------------------------------------------------------------->
  const handleDayRangeClick = (selectedRange: DateRange) => {
    setRange(selectedRange);
    if (selectedRange?.from) {
      setSelectedStartYear(selectedRange.from.getFullYear());
      setSelectedStartMonth(selectedRange.from.getMonth() + 1);
      setSelectedStartDay(selectedRange.from.getDate());
    }
    if (selectedRange?.to) {
      setSelectedEndYear(selectedRange.to.getFullYear());
      setSelectedEndMonth(selectedRange.to.getMonth() + 1);
      setSelectedEndDay(selectedRange.to.getDate());
    }
  };
  const handleDayClick = (day: Date) => {
    if (!range || !range.from) {
      setRange({ from: day, to: undefined });
    }
    else if (!range.to) {
      const newRange = day > range.from
      ? { from: range.from, to: day }
      : { from: day, to: range.from };
      handleDayRangeClick(newRange);
    }
    else {
      setRange({ from: day, to: undefined });
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonSleepToday = () => {
    return (
      <button className="btn btn-success me-2" onClick={() => {
        setCurrentMonth(today);
        setSelectedStartYear(undefined);
        setSelectedStartMonth(undefined);
        setSelectedStartDay(undefined);
        setSelectedEndYear(undefined);
        setSelectedEndMonth(undefined);
        setSelectedEndDay(undefined);
        setRange(undefined);
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() =>{
        setSelectedStartYear(undefined);
        setSelectedStartMonth(undefined);
        setSelectedStartDay(undefined);
        setSelectedEndYear(undefined);
        setSelectedEndMonth(undefined);
        setSelectedEndDay(undefined);
        setRange(undefined);
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

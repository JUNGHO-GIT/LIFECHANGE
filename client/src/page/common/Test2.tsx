import React, { useState } from "react";
import { DayClickEventHandler, DateRange, DayPicker } from "react-day-picker";
import { createGlobalStyle } from "styled-components";
import { addMonths, isSameDay, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
const TestStyle = createGlobalStyle`
  .today, .rdp-caption_label, .rdp-head_cell {
    font-weight: bolder;
  }
  .today, .rdp-caption_label {
    font-size: 150%;
  }
  .rdp-head_cell {
    font-size: 120%;
  }
  .today {
    color: #ff0000;
  }
  .selected {
    background-color: #0d6efd !important;
    color: #fff !important;
  }
  .selected:not([disabled]) {
    background-color: #0d6efd !important;
    color: #fff !important;
  }
  .selected:hover {
    background-color: #0d6efd !important;
    color: #fff !important;
  }
  .selected:hover:not([disabled]) {
   background-color: #0d6efd !important;
    color: #fff !important;
  }
  .rdp-day:focus {
    background-color: #0d6efd !important;
    color: #fff !important;
  }
  .rdp-day:active {
    background-color: #0d6efd !important;
    color: #fff !important;
  }
  .disabled, .outside {
    color: #999;
  }
  .inside {
    color: #000;
  }
`;

// ------------------------------------------------------------------------------------------------>
const DayComponent = () => {
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
          <span>{`${selectedYear}`}년</span>
          <span>{`${selectedMonth + 1}`}월</span>
          <span>{`${selectedDay}`}일</span>
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
    <div className="container"><TestStyle />
      <div className="row">
        <div className="col-12">
          <DayPicker
            mode="single"
            showOutsideDays
            selected={new Date(selectedYear, selectedMonth, selectedDay)}
            month={new Date(selectedYear, selectedMonth)}
            locale={ko}
            weekStartsOn={0}
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


// ------------------------------------------------------------------------------------------------>
const RangeComponent = () => {
  const today = new Date(
    moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString()
  );

  const [selectedStartYear, setSelectedStartYear] = useState<number>();
  const [selectedStartMonth, setSelectedStartMonth] = useState<number>();
  const [selectedStartDay, setSelectedStartDay] = useState<number>();
  const [selectedEndYear, setSelectedEndYear] = useState<number>();
  const [selectedEndMonth, setSelectedEndMonth] = useState<number>();
  const [selectedEndDay, setSelectedEndDay] = useState<number>();

  const [range, setRange] = useState<DateRange | undefined>();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);

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

  const handleResetClick = () => {
    setSelectedStartYear(undefined);
    setSelectedStartMonth(undefined);
    setSelectedStartDay(undefined);
    setSelectedEndYear(undefined);
    setSelectedEndMonth(undefined);
    setSelectedEndDay(undefined);
    setRange(undefined);
  };

  const selectedInfo = () => {
    if (
      selectedStartYear &&
      selectedStartMonth &&
      selectedStartDay &&
      selectedEndYear &&
      selectedEndMonth &&
      selectedEndDay
    ) {
      return (
        <div>
          <hr />
          <span>{`${selectedStartYear}`}년</span>
          <span>{`${selectedStartMonth + 1}`}월</span>
          <span>{`${selectedStartDay}`}일</span>
          <span> ~ </span>
          <span>{`${selectedEndYear}`}년</span>
          <span>{`${selectedEndMonth + 1}`}월</span>
          <span>{`${selectedEndDay}`}일</span>
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
            setSelectedStartYear(today.getFullYear());
            setSelectedStartMonth(today.getMonth() + 1);
            setSelectedStartDay(today.getDate());
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
            mode="range"
            showOutsideDays
            selected={range}
            month={currentMonth}
            onSelect={handleDayRangeClick}
            locale={ko}
            weekStartsOn={0}
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

// ------------------------------------------------------------------------------------------------>
export const Test2 = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <DayComponent />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-12">
          <RangeComponent />
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

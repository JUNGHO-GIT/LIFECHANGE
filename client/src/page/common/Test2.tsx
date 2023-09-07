import React, { useState } from "react";
import { DayClickEventHandler, DateRange, DayPicker } from 'react-day-picker';
import { createGlobalStyle } from "styled-components";
import { addMonths, isSameDay, differenceInDays } from 'date-fns';
import { ko } from 'date-fns/locale';
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
  const koreanDate = new Date(moment.tz('Asia/Seoul').format('YYYY-MM-DD'));
  const today = new Date();
  const nextMonth = addMonths(today, 1);

  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<Date>(nextMonth);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);

  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    setSelectedDay(day);
    setSelectedMonth(day);
    setSelectedYear(day.getFullYear());
  };

  const handleResetClick = () => {
    setSelectedDay(undefined);
  };

  const footer = () => {

    const selectedInfo = () => {
      if (selectedDay) {
        return (
          <div>
            <hr/>
            <p>{`날짜 : ${selectedDay.getMonth() + 1}월 ${selectedDay.getDate()}일`}</p>
            <hr/>
          </div>
        );
      }
    };

    return (
      <div>
        <p>{selectedInfo()}</p>
        <button className="btn btn-success me-2" onClick={() => setMonth(today)}>Today</button>
        <button className="btn btn-primary me-2" onClick={handleResetClick}>Reset</button>
      </div>
    );
  };

  return (
    <div className="container">
      <TestStyle />
      <div className="row">
        <div className="col-12">
          <DayPicker
            mode="single"
            showOutsideDays
            selected={selectedDay}
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
            onSelect={handleDayClick}
            locale={ko}
            weekStartsOn={0}
            footer={footer()}
            modifiersClassNames={{
              today: 'today',
              selected: 'selected',
              disabled: 'disabled',
              outside: 'outside',
              inside: 'inside'
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------>
const RangeComponent = () => {
  const koreanDate = new Date(moment.tz('Asia/Seoul').format('YYYY-MM-DD'));
  const today = new Date();
  const nextMonth = addMonths(today, 1);
  const defaultSelected = { from: koreanDate };

  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<Date>(nextMonth);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);

  const [range, setRange] = useState<DateRange>(defaultSelected);
  const [selectedStart, setSelectedStart] = useState<Date[]>([]);
  const [selectedEnd, setSelectedEnd] = useState<Date[]>([]);

  const handleResetClick = () => {
    setRange({});
    setSelectedStart([]);
    setSelectedEnd([]);
  };

  const footer = () => {

    const selectedInfo = () => {
      if (selectedStart[0] && selectedEnd[0]) {
        const duration = differenceInDays(selectedEnd[0], selectedStart[0]) + 1;
        return (
          <div>
            <hr/>
            <p>{`날짜 : ${selectedStart[0].getMonth() + 1}월 ${selectedStart[0].getDate()}일 ~ ${selectedEnd[0].getMonth() + 1}월 ${selectedEnd[0].getDate()}일`}</p>
            <p>{`기간 : ${duration}일`}</p>
            <hr/>
          </div>
        );
      }
    };

    return (
      <div>
        <p>{selectedInfo()}</p>
        <button className="btn btn-success me-2" onClick={() => setSelectedMonth(today)}>Today</button>
        <button className="btn btn-primary me-2" onClick={handleResetClick}>Reset</button>
      </div>
    );
  };

  return (
    <div className="container">
      <TestStyle />
      <div className="row">
        <div className="col-12">
          <DayPicker
            mode="range"
            showOutsideDays
            selected={range}
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
            onSelect={range => {
                setRange(range || defaultSelected);
                const [startDate, endDate] = range?.to && range.to < range.from ? [range.to, range.from] : [range?.from, range?.to];
                setSelectedStart([startDate]);
                setSelectedEnd([endDate]);
              }}
              locale={ko}
              weekStartsOn={0}
              footer={footer()}
              modifiersClassNames={{
                today: 'today',
                selected: 'selected',
                disabled: 'disabled',
                outside: 'outside',
                inside: 'inside'
              }}
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
        <div className="col-6">
          <DayComponent />
        </div>
        <div className="col-6">
          <RangeComponent />
        </div>
      </div>
    </div>
  );
};
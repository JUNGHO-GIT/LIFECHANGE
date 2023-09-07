import React, { useState } from "react";
import { DayClickEventHandler, DateRange, DayPicker } from 'react-day-picker';
import { createGlobalStyle } from "styled-components";
import { addMonths, isSameDay, differenceInDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
const TestStyle = createGlobalStyle`
  .today {
    font-weight: bolder;
    font-size: 150%;
    color : #ff0000;
  }
  .selected {
    background-color: #0d6efd;
    color: #ffffff;
  }
  .selected:not([disabled]) {
    background-color: #0d6efd;
    color : #fff;
  }
  .selected:hover:not([disabled]) {
    color: blue;
  }
  .disabled {
    color : #999;
  }
  .outside {
    color: #999;
  }
  .inside {
    color: #000;
  }
  .rdp-caption_label {
    text-align: center;
    font-weight: bolder;
    font-size: 150%;
  }
  .rdp-head_cell {
    font-weight: bold;
    font-size: 120%;
  }
`;

// ------------------------------------------------------------------------------------------------>
export const Test2 = () => {
  const koreanDate = new Date(moment.tz('Asia/Seoul').format('YYYY-MM-DD'));
  const today = new Date();
  const nextMonth = addMonths(new Date(), 1);
  const defaultSelected = { from: koreanDate };

  const [month, setMonth] = useState<Date>(nextMonth);
  const [range, setRange] = useState<DateRange>(defaultSelected);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [selectedStart, setSelectedStart] = useState<Date[]>([]);
  const [selectedEnd, setSelectedEnd] = useState<Date[]>([]);

  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    if (modifiers.selected) {
      setSelectedDays(prev => prev.filter(selectedDay => !isSameDay(day, selectedDay)));
    }
    else {
      setSelectedDays(prev => [...prev, day]);
    }
  };

  const handleResetClick = () => {
    setRange({});
    setSelectedDays([]);
    setSelectedStart([]);
    setSelectedEnd([]);
  };

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

  const footer = (
    <div>
      <p>{selectedInfo()}</p>
      <button className="btn btn-success me-2" onClick={() => setMonth(today)}>Today</button>
      <button className="btn btn-primary me-2" onClick={handleResetClick}>Reset</button>
    </div>
  );

  return (
    <div className="container">
      <TestStyle />
      <div className="row">
        <div className="col-12">
          <DayPicker
            mode="range"
            showOutsideDays
            selected={range}
            month={month}
            onMonthChange={setMonth}
            onSelect={range => {
              setRange(range || defaultSelected);
              if (range) {
                let startDate:any = range.from;
                let endDate:any = range.to;

                // 시작 날짜만 선택했을 경우
                if (startDate && !endDate) {
                  setSelectedStart([startDate]);
                  setSelectedEnd([]);
                  return;
                }

                if (endDate && endDate < startDate) {
                  [startDate, endDate] = [endDate, startDate];
                }

                setSelectedStart([startDate]);
                setSelectedEnd([endDate]);
              } else {
                setSelectedStart([]);
                setSelectedEnd([]);
              }
            }}
            onDayClick={handleDayClick}
            locale={ko}
            weekStartsOn={0}
            footer={footer}
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
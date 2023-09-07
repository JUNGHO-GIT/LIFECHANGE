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
    font-size: 140%;
    color: red;
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

  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    if (modifiers.selected) {
      setSelectedDays(prev => prev.filter(selectedDay => !isSameDay(day, selectedDay)));
    } else {
      setSelectedDays(prev => [...prev, day]);
    }
  };

  const handleResetClick = () => {
    setRange({});
    setSelectedDays([]);
  };

  const selectedInfo = () => {
    if (range.from && range.to) {
      const duration = differenceInDays(range.to, range.from) + 1;
      return (
        <div>
          <p>{`날짜 : ${range.from.getMonth() + 1}월 ${range.from.getDate()}일 ~ ${range.to.getMonth() + 1}월 ${range.to.getDate()}일`}</p>
          <p>{`기간 : ${duration}일`}</p>
        </div>
      );
    }
    else {
      return (
        <p>날짜를 선택하세요</p>
      );
    }
  };

  const footer = (
    <div>
      <p>{selectedInfo()}</p>
      <button onClick={() => setMonth(today)}>Go to Today</button>
      <button onClick={handleResetClick}>Reset</button>
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
            onSelect={range => setRange(range || defaultSelected)}
            onDayClick={handleDayClick}
            locale={ko}
            weekStartsOn={0}
            footer={footer}
            modifiersClassNames={{ today: 'today' }}
          />
        </div>
      </div>
    </div>
  );
};
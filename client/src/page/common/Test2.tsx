import React, { useState } from "react";
import { addMonths, isSameMonth, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import {SelectRangeEventHandler, DayClickEventHandler, DateRange, DayPicker}from 'react-day-picker';
import moment from "moment-timezone";
import {createGlobalStyle} from "styled-components";

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

  // ---------------------------------------------------------------------------------------------->
  const koreanDate = new Date(moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString());
  const today = new Date();
  const nextMonth = addMonths(new Date(), 1);
  const defaultSelected = { from: koreanDate };
  const [month, setMonth] = useState<Date>(nextMonth);
  const [range, setRange] = useState<DateRange>(defaultSelected);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);

  // ---------------------------------------------------------------------------------------------->
  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    const newSelectedDays = [...selectedDays];
    if (modifiers.selected) {
      const index = selectedDays.findIndex((selectedDay) =>
        isSameDay(day, selectedDay)
      );
      newSelectedDays.splice(index, 1);
    }
    else {
      newSelectedDays.push(day);
    }
    setSelectedDays(newSelectedDays);
  };

  const handleResetClick = () => {
    setRange({});
    setSelectedDays([]);
  };

  const handleSelect: SelectRangeEventHandler = (range) => {
    setRange(range || defaultSelected);
  };

  // ---------------------------------------------------------------------------------------------->
  const footer = (
    <div>
      <p>
        You selected {selectedDays.length} days.{' '}
      </p>
      <button onClick={() => setMonth(today)}>
        Go to Today
      </button>
      <button onClick={handleResetClick}>
        Reset
      </button>
    </div>
  );

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container"><TestStyle />
      <div className="row">
        <div className="col-12">
          <DayPicker
            mode="range"
            showOutsideDays
            selected={range}
            month={month}
            onMonthChange={setMonth}
            onSelect={handleSelect}
            onDayClick={handleDayClick}
            locale={ko}
            weekStartsOn={0}
            footer={footer}
            modifiersClassNames={{
              today: 'today'
            }}
          />
        </div>
      </div>
    </div>
  );
};

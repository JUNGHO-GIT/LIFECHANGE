import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const CalendarListStyle = createGlobalStyle`
  .calendar {
    width: 50%;
    margin: 0 auto;
    margin-top: 100px;
    margin-bottom: 100px;
  }
`;

// ------------------------------------------------------------------------------------------------>
const FullCalendarFlow = () => {
  return (
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
    />
  );
}

// ------------------------------------------------------------------------------------------------>
const CalendarList = () => {
  return (
    <div>
      <CalendarListStyle />
      <div className="calendar">
        <FullCalendarFlow />
      </div>
    </div>
  );
};

export default CalendarList;
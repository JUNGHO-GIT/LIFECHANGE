import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const CalendarListStyle = createGlobalStyle`
  .calendar {
    width: 50%;
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
    <>
      <CalendarListStyle />
      <section className="calendarList custom-flex-center">
        <div className="calendar">
          <div className="empty-h50"></div>
          <h1 className="mb-3">Calendar List</h1>
          <FullCalendarFlow />
          <div className="empty-h50"></div>
        </div>
      </section>
    </>
  );
};

export default CalendarList;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

// ------------------------------------------------------------------------------------------------>
const CalendarDetailStyle = createGlobalStyle`
  .calendarDetail {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-calendarDetail {
    max-width: 330px;
    padding: 15px;
  }

  .form-calendarDetail .form-floating:focus-within {
    z-index: 2;
  }
`;

// ------------------------------------------------------------------------------------------------>
const CalendarDetail = () => {
  const { params } = useParams<{ params: string }>();
  if (!params) {
    return <div>Loading...</div>;
  }
  const [year, month, day] = params.split("-");

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="calendarDetail">
      <CalendarDetailStyle />
      <main className="form-calendarDetail">
        <h1 className="h3 mb-3 fw-normal">일정 상세</h1>
        <div className="form-floating">
          <span>
            {year}년 {month}월 {day}일
          </span>
        </div>
        <br/>
      </main>
    </div>
  );
};

export default CalendarDetail;


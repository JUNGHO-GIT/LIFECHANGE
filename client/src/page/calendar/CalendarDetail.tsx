// CalendarDetail.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

// ------------------------------------------------------------------------------------------------>
const CalendarDetailStyle = createGlobalStyle`
  .calendar {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-calendar {
    max-width: 330px;
    padding: 15px;
  }

  .form-calendar .form-floating:focus-within {
    z-index: 2;
  }

  .form-calendar input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-calendar input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
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
    <>
      <CalendarDetailStyle />
      <section className="calendar custom-flex-center">
        <div className="row">
          <div className="col-12">
            <div className="empty-h50"></div>
            <h1 className="mb-3">Calendar Detail</h1>
            <div className="empty-h20"></div>
            <p className="fw-5" id="year"> Year : <b>{year}년</b> </p>
            <p className="fw-5" id="month"> Month : <b>{month}월</b> </p>
            <p className="fw-5" id="day"> Day : <b>{day}일</b> </p>
            <button className="w-100 btn btn-lg btn-primary" type="button"
            onClick={() => { window.location.reload(); }}>Refresh</button>
            <div className="empty-h50"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CalendarDetail;


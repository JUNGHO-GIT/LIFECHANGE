// CalendarDetail.tsx
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
export const CalendarDetail = () => {
  const location = useLocation();
  const year = location.state.calendar_year;
  const month = location.state.calendar_month;
  const day = location.state.calendar_day;
  const URL = "http://127.0.0.1:4000/calendar";
  const TITLE = "Calendar Detail";

  // ---------------------------------------------------------------------------------------------->
  const calendarDetailTable = () => {
    return (
      <div className="card">
        <div className="card-body">
          <p className="fw-5"> Year : <b>{year}년</b> </p>
          <p className="fw-5"> Month : <b>{month}월</b> </p>
          <p className="fw-5"> Day : <b>{day}일</b> </p>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-4">
          {calendarDetailTable()}
        </div>
        <div className="col-6">
        </div>
      </div>
    </div>
  );
};
// CalendarDetail.tsx
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
const CalendarDetail = () => {
  const { params } = useParams<{ params: string }>();
  const [year, month, day] = params?.split("-") ?? [];

  // ---------------------------------------------------------------------------------------------->
  const calendarDetailTable = () => {
    return (
      <div className="card">
        <div className="card-body">
          <p className="fw-5" id="year"> Year : <b>{year}년</b> </p>
          <p className="fw-5" id="month"> Month : <b>{month}월</b> </p>
          <p className="fw-5" id="day"> Day : <b>{day}일</b> </p>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonRefreshPage = () => {
    return (
      <Link to={`/calendarList`}>
        <button className="btn btn-primary ms-2" type="button">
          Refresh
        </button>
      </Link>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">Calendar Detail</h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-10">
          {calendarDetailTable()}
          <br/>
          {buttonRefreshPage()}
        </div>
      </div>
    </div>
  );
};

export default CalendarDetail;


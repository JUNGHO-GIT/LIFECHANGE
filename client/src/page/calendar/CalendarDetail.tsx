// CalendarDetail.tsx
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
const CalendarDetail = () => {
  const { params } = useParams<{ params: string }>();
  if (!params) {
    return <div>Loading...</div>;
  }
  const [year, month, day] = params.split("-");

  // ---------------------------------------------------------------------------------------------->
  const CalendarDetailTable = () => {
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
        <button className="btn btn-primary" type="button">
          Refresh
        </button>
      </Link>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h1 className="mb-3 fw-9">Calendar Detail</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <div className="empty-h20"></div>
          {CalendarDetailTable()}
          <div className="empty-h20"></div>
          {buttonRefreshPage()}
          <div className="empty-h50"></div>
        </div>
      </div>
    </div>
  );
};

export default CalendarDetail;


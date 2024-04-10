// ButtonNode.jsx

import React from "react";
import moment from "moment-timezone";

// 9. button -------------------------------------------------------------------------------------->
export const ButtonNode = ({
  calendarOpen, setCalendarOpen, strDate, setStrDate, STATE, flowSave, navParam, type
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 9. button ------------------------------------------------------------------------------------>
  function buttonCalendar () {
    return (
      <button type="button" className={`btn btn-sm ${calendarOpen ? "btn-danger" : "btn-primary"} m-5`} onClick={() => {
        setCalendarOpen(!calendarOpen)
      }}>
        {calendarOpen ? "x" : "o"}
      </button>
    );
  };
  function buttonToday () {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setStrDate(koreanDate);
        localStorage.clear();
      }}>
        Today
      </button>
    );
  };
  function buttonSave () {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        flowSave();
      }}>
        Save
      </button>
    );
  };
  function buttonRefresh () {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        navParam(STATE.refresh);
      }}>
        Refresh
      </button>
    );
  };
  function buttonList () {
    return (
      <button type="button" className="btn btn-sm btn-secondary me-2" onClick={() => {
        navParam(STATE.toList);
      }}>
        List
      </button>
    );
  };
  return (
    type === "list" ? (
      <div className="d-inline-flex">
        {buttonCalendar()}
        {buttonToday()}
        {buttonRefresh()}
      </div>
    ) : type === "save" ? (
      <div className="d-inline-flex">
        {buttonSave()}
        {buttonList()}
        {buttonRefresh()}
      </div>
    ) : null
  );
};
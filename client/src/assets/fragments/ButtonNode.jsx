// ButtonNode.jsx

import React from "react";
import moment from "moment-timezone";

// 9. button -------------------------------------------------------------------------------------->
export const ButtonNode = ({
  CALENDAR, setCALENDAR, DATE, setDATE, STATE, setSTATE, flowSave, navParam, type
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 9. button ------------------------------------------------------------------------------------>
  function buttonCalendar () {
    return (
      <button type="button" className={`btn btn-sm ${CALENDAR.calOpen ? "btn-danger" : "btn-primary"} m-5`} onClick={() => {
        setCALENDAR((prev) => ({
          ...prev,
          calOpen: !prev.calOpen,
        }));
      }}>
        {CALENDAR.calOpen ? "x" : "o"}
      </button>
    );
  };
  function buttonToday () {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setDATE((prev) => ({
          ...prev,
          strDt: koreanDate,
        }));
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
  function buttonUpdate () {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        STATE.date = DATE.strDt;
        navParam(STATE.toSave, {
          state: STATE,
        });
      }}>
        Update
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
        STATE.date = DATE.strDt;
        navParam(STATE.toList, {
          state: STATE,
        });
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
    ) : type === "detail" ? (
      <div className="d-inline-flex">
        {buttonUpdate()}
        {buttonList()}
        {buttonRefresh()}
      </div>
    ) : null
  );
};
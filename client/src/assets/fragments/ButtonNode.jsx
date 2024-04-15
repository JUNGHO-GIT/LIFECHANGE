// ButtonNode.jsx

import React from "react";
import moment from "moment-timezone";

// 9. button -------------------------------------------------------------------------------------->
export const ButtonNode = ({
  CALENDAR, setCALENDAR, DATE, setDATE, SEND, flowSave, navParam, part, plan, type
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 9. button ------------------------------------------------------------------------------------>
  function buttonCalendar () {
    return (
      <button type={"button"} className={`btn btn-sm ${CALENDAR.calOpen ? "btn-danger" : "btn-primary"} m-5`} onClick={() => {
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
      <button type={"button"} className={"btn btn-sm btn-success me-2"} onClick={() => {
        localStorage.clear();
        setDATE((prev) => ({
          ...prev,
          startDt: koreanDate,
          endDt: koreanDate,
        }));
      }}>
        Today
      </button>
    );
  };
  function buttonSave () {
    return (
      <button type={"button"} className={"btn btn-sm btn-primary me-2"} onClick={() => {
        localStorage.clear();
        flowSave();
      }}>
        Save
      </button>
    );
  };
  function buttonUpdate () {
    return (
      <button type={"button"} className={"btn btn-sm btn-primary ms-2"} onClick={() => {
        localStorage.clear();
        SEND.startDt = DATE.startDt;
        SEND.endDt = DATE.endDt;
        navParam(SEND.toSave, {
          state: SEND,
        });
      }}>
        Update
      </button>
    );
  };
  function buttonRefresh () {
    return (
      <button type={"button"} className={"btn btn-sm btn-success me-2"} onClick={() => {
        navParam(SEND.refresh);
      }}>
        Refresh
      </button>
    );
  };
  function buttonList () {
    return (
      <button type={"button"} className={"btn btn-sm btn-secondary me-2"} onClick={() => {
        SEND.startDt = DATE.startDt;
        SEND.endDt = DATE.endDt;
        navParam(SEND.toList, {
          state: SEND,
        });
      }}>
        List
      </button>
    );
  };
  function buttonSearch () {
    return (
      <button type={"button"} className={"btn btn-sm btn-secondary me-2"} onClick={() => {
        SEND.startDt = DATE.startDt;
        SEND.endDt = DATE.endDt;
        navParam(SEND.toSearch, {
          state: SEND,
        });
      }}>
        Search
      </button>
    );
  };

  return (
    part === "food" && type === "list" ? (
      <div className={"d-inline-flex"}>
        {buttonCalendar()}
        {buttonToday()}
        {buttonRefresh()}
      </div>
    ) : part === "food" && type === "detail" ? (
      <div className={"d-inline-flex"}>
        {buttonUpdate()}
        {buttonList()}
        {buttonRefresh()}
      </div>
    ) : part === "food" && type === "save" ? (
      <div className={"d-inline-flex"}>
        {buttonSave()}
        {buttonSearch()}
        {buttonRefresh()}
      </div>
    ) : part !== "food" && type === "list" ? (
      <div className={"d-inline-flex"}>
        {buttonCalendar()}
        {buttonToday()}
        {buttonRefresh()}
      </div>
    ) : part !== "food" && type === "detail" ? (
      <div className={"d-inline-flex"}>
        {buttonUpdate()}
        {buttonList()}
        {buttonRefresh()}
      </div>
    ) : part !== "food" && type === "save" ? (
      <div className={"d-inline-flex"}>
        {buttonSave()}
        {buttonList()}
        {buttonRefresh()}
      </div>
    ) : null
  );
};
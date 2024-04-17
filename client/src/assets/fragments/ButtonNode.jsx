// ButtonNode.jsx

import React from "react";
import moment from "moment-timezone";
import Button from "react-bootstrap/Button";

// 9. button -------------------------------------------------------------------------------------->
export const ButtonNode = ({
  CALENDAR, setCALENDAR, DATE, setDATE, SEND, flowSave, navParam, part, plan, type
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 9. button ------------------------------------------------------------------------------------>
  function buttonCalendar () {
    return (
      <Button size={"sm"} variant={"primary"} className={"me-2"} type={"button"}
        onClick={() => {
          setCALENDAR((prev) => ({
            ...prev,
            calOpen: !prev.calOpen,
          }));
        }}
      >
        {CALENDAR.calOpen ? "o" : "x"}
      </Button>
    );
  };
  function buttonToday () {
    return (
      <Button size={"sm"} variant={"success"} className={"me-2"} type={"button"}
        onClick={() => {
          setDATE((prev) => ({
            ...prev,
            startDt: koreanDate,
            endDt: koreanDate,
          }));
        }}
      >
        Today
      </Button>
    );
  };
  function buttonSave () {
    return (
      <Button size={"sm"} variant={"primary"} className={"me-2"} type={"button"}
        onClick={() => {
          flowSave();
        }}
      >
        Save
      </Button>
    );
  };
  function buttonUpdate () {
    return (
      <Button size={"sm"} variant={"primary"} className={"me-2"} type={"button"}
        onClick={() => {
          SEND.startDt = DATE.startDt;
          SEND.endDt = DATE.endDt;
          navParam(SEND.toUpdate, {
            state: SEND,
          });
        }}
      >
        Update
      </Button>
    );
  };
  function buttonRefresh () {
    return (
      <Button size={"sm"} variant={"success"} className={"me-2"} type={"button"}
        onClick={() => {
          navParam(SEND.refresh);
        }}
      >
        Refresh
      </Button>
    );
  };
  function buttonList () {
    return (
      <Button size={"sm"} variant={"secondary"} className={"me-2"} type={"button"}
        onClick={() => {
          SEND.startDt = DATE.startDt;
          SEND.endDt = DATE.endDt;
          navParam(SEND.toList, {
            state: SEND,
          });
        }}
      >
        List
      </Button>
    );
  };
  function buttonSearch () {
    return (
      <Button size={"sm"} variant={"secondary"} className={"me-2"} type={"button"}
        onClick={() => {
          SEND.startDt = DATE.startDt;
          SEND.endDt = DATE.endDt;
          navParam(SEND.toSearch, {
            state: SEND,
          });
        }}
      >
        Search
      </Button>
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
    ) : part === "food" && type === "list" ? (
      <div className={"d-inline-flex"}>
        {buttonCalendar()}
        {buttonToday()}
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
    ) : part !== "food" && type === "list" ? (
      <div className={"d-inline-flex"}>
        {buttonCalendar()}
        {buttonToday()}
        {buttonRefresh()}
      </div>
    ) : null
  );
};
// ButtonNode.jsx

import React from "react";
import moment from "moment-timezone";
import {Button} from "react-bootstrap";

// 9. button -------------------------------------------------------------------------------------->
export const ButtonNode = ({
  CALENDAR, setCALENDAR, DATE, setDATE, SEND, FILTER, setFILTER, PAGING, setPAGING,
  flowSave, navParam, part, plan, type
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 9. button ------------------------------------------------------------------------------------>
  function buttonCalendar () {
    return (
      <React.Fragment>
        <Button size={"sm"} variant={"primary"} className={"button me-5"} type={"button"}
          onClick={() => {
            setCALENDAR((prev) => ({
              ...prev,
              calOpen: !prev.calOpen,
            }));
          }}
        >
          {CALENDAR.calOpen ? "o" : "x"}
        </Button>
      </React.Fragment>
    );
  };
  function buttonToday () {
    return (
      <React.Fragment>
        <Button size={"sm"} variant={"success"} className={"button me-5"} type={"button"}
          onClick={() => {
            setFILTER((prev) => ({
              ...prev,
              type: "day",
            }));
            setPAGING((prev) => ({
              ...prev,
              page: 1,
            }));
            setDATE((prev) => ({
              ...prev,
              startDt: koreanDate,
              endDt: koreanDate,
            }));
          }}
        >
          Today
        </Button>
      </React.Fragment>
    );
  };
  function buttonSave () {
    return (
      <React.Fragment>
        <Button size={"sm"} variant={"primary"} className={"button me-5"} type={"button"}
          onClick={() => (flowSave())}
        >
          Save
        </Button>
      </React.Fragment>
    );
  };
  function buttonUpdate () {
    return (
      <React.Fragment>
        <Button size={"sm"} variant={"primary"} className={"button me-5"} type={"button"}
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
      </React.Fragment>
    );
  };
  function buttonList () {
    return (
      <React.Fragment>
        <Button size={"sm"} variant={"secondary"} className={"button me-5"} type={"button"}
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
      </React.Fragment>
    );
  };
  function buttonSearch () {
    return (
      <React.Fragment>
        <Button size={"sm"} variant={"secondary"} className={"button me-5"} type={"button"}
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
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      {part === "food" && type === "list" ? (
        <div className={"d-inline-flex"}>
          {buttonCalendar()}
          {buttonToday()}
        </div>
      ) : part === "food" && type === "detail" ? (
        <div className={"d-inline-flex"}>
          {buttonUpdate()}
          {buttonList()}
        </div>
      ) : part === "food" && type === "save" ? (
        <div className={"d-inline-flex"}>
          {buttonSave()}
          {buttonSearch()}
        </div>
      ) : part === "food" && type === "list" ? (
        <div className={"d-inline-flex"}>
          {buttonCalendar()}
          {buttonToday()}
        </div>
      ) : part !== "food" && type === "list" ? (
        <div className={"d-inline-flex"}>
          {buttonCalendar()}
          {buttonToday()}
        </div>
      ) : part !== "food" && type === "detail" ? (
        <div className={"d-inline-flex"}>
          {buttonUpdate()}
          {buttonList()}
        </div>
      ) : part !== "food" && type === "save" ? (
        <div className={"d-inline-flex"}>
          {buttonSave()}
          {buttonList()}
        </div>
      ) : part !== "food" && type === "list" ? (
        <div className={"d-inline-flex"}>
          {buttonCalendar()}
          {buttonToday()}
        </div>
      ) : null}
    </React.Fragment>
  );
};
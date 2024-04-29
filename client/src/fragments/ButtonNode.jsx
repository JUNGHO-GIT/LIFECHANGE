// ButtonNode.jsx

import React from "react";
import moment from "moment-timezone";
import {Button} from "react-bootstrap";

// 9. button -------------------------------------------------------------------------------------->
export const ButtonNode = ({
  DATE, setDATE, SEND, FILTER, setFILTER, flowSave, navParam, part, plan, type
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 9. button ------------------------------------------------------------------------------------>
  function buttonToday () {
    return (
      <React.Fragment>
        <Button size={"sm"} className={"success-btn"} type={"button"} onClick={() => {
          setFILTER((prev) => ({
            ...prev,
            type: "day",
          }));
          setDATE((prev) => ({
            ...prev,
            startDt: koreanDate,
            endDt: koreanDate,
          }));
        }}>
          Today
        </Button>
      </React.Fragment>
    );
  };
  function buttonSave () {
    return (
      <React.Fragment>
        <Button size={"sm"} className={"primary-btn"} type={"button"} onClick={() => {
          flowSave();
        }}>
          Save
        </Button>
      </React.Fragment>
    );
  };
  function buttonUpdate () {
    return (
      <React.Fragment>
        <Button size={"sm"} className={"primary-btn"} type={"button"} onClick={() => {
          SEND.startDt = DATE.startDt;
          SEND.endDt = DATE.endDt;
          navParam(SEND.toUpdate, {
            state: SEND,
          });
        }}>
          Update
        </Button>
      </React.Fragment>
    );
  };
  function buttonList () {
    return (
      <React.Fragment>
        <Button size={"sm"} className={"secondary-btn"} type={"button"} onClick={() => {
          SEND.startDt = DATE.startDt;
          SEND.endDt = DATE.endDt;
          navParam(SEND.toList, {
            state: SEND,
          });
        }}>
          List
        </Button>
      </React.Fragment>
    );
  };
  function buttonSearch () {
    return (
      <React.Fragment>
        <Button size={"sm"} className={"secondary-btn"} type={"button"} onClick={() => {
          SEND.startDt = DATE.startDt;
          SEND.endDt = DATE.endDt;
          navParam(SEND.toSearch, {
            state: SEND,
          });
        }}>
          Search
        </Button>
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      {part === "food" && type === "list" ? (
        <div className={"d-inline-flex"}>
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
          {buttonToday()}
        </div>
      ) : part !== "food" && type === "list" ? (
        <div className={"d-inline-flex"}>
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
          {buttonToday()}
        </div>
      ) : null}
    </React.Fragment>
  );
};
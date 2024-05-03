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
  const buttonCalendar = () => (
    <React.Fragment>
      <Button className={"primary-btn"} type={"button"} onClick={() => {
        setCALENDAR((prev) => ({
          ...prev,
          calOpen: !prev.calOpen,
        }));
      }}>
        달력
      </Button>
    </React.Fragment>
  );
  const buttonToday = () => (
    <React.Fragment>
      <Button className={"success-btn"} type={"button"} onClick={() => {
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
      }}>
        Today
      </Button>
    </React.Fragment>
  );
  const buttonSave = () => (
    <React.Fragment>
      <Button className={"primary-btn"} type={"button"} onClick={() => {
        flowSave();
      }}>
        Save
      </Button>
    </React.Fragment>
  );
  const buttonUpdate = () => (
    <React.Fragment>
      <Button className={"primary-btn"} type={"button"} onClick={() => {
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
  const buttonList = () => (
    <React.Fragment>
      <Button className={"secondary-btn"} type={"button"} onClick={() => {
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
  const buttonSearch = () => (
    <React.Fragment>
      <Button className={"secondary-btn"} type={"button"} onClick={() => {
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

  // 5. return ------------------------------------------------------------------------------------>
  return (
    <React.Fragment>
      <div className={"btn-wrapper d-inline-flex"}>
        {part === "food" && type === "list" ? (
          <React.Fragment>
            {buttonCalendar()}
            {buttonToday()}
          </React.Fragment>
        ) : part === "food" && type === "detail" ? (
          <React.Fragment>
            {buttonUpdate()}
            {buttonList()}
          </React.Fragment>
        ) : part === "food" && type === "save" ? (
          <React.Fragment>
            {buttonSave()}
            {buttonSearch()}
          </React.Fragment>
        ) : part === "food" && type === "list" ? (
          <React.Fragment>
            {buttonCalendar()}
            {buttonToday()}
          </React.Fragment>
        ) : part !== "food" && type === "list" ? (
          <React.Fragment>
            {buttonCalendar()}
            {buttonToday()}
          </React.Fragment>
        ) : part !== "food" && type === "detail" ? (
          <React.Fragment>
            {buttonUpdate()}
            {buttonList()}
          </React.Fragment>
        ) : part !== "food" && type === "save" ? (
          <React.Fragment>
            {buttonSave()}
            {buttonList()}
          </React.Fragment>
        ) : part !== "food" && type === "list" ? (
          <React.Fragment>
            {buttonCalendar()}
            {buttonToday()}
          </React.Fragment>
        ) : null}
      </div>
    </React.Fragment>
  );
};
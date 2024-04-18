// ButtonNode.jsx

import React from "react";
import moment from "moment-timezone";
import {Container, Table, FormGroup, Form, ButtonGroup, Button, CardGroup, Card, Row, Col, Collapse} from "react-bootstrap";

// 9. button -------------------------------------------------------------------------------------->
export const ButtonNode = ({
  CALENDAR, setCALENDAR, DATE, setDATE, SEND, flowSave, navParam, part, plan, type
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 9. button ------------------------------------------------------------------------------------>
  function buttonCalendar () {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };
  function buttonToday () {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };
  function buttonSave () {
    return (
      <React.Fragment>
        <Button size={"sm"} variant={"primary"} className={"me-2"} type={"button"}
          onClick={() => {
            flowSave();
          }}
        >
          Save
        </Button>
      </React.Fragment>
    );
  };
  function buttonUpdate () {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };
  function buttonRefresh () {
    return (
      <React.Fragment>
        <Button size={"sm"} variant={"success"} className={"me-2"} type={"button"}
        onClick={() => {
          navParam(SEND.refresh);
        }}
      >
        Refresh
      </Button>
      </React.Fragment>
    );
  };
  function buttonList () {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };
  function buttonSearch () {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      {part === "food" && type === "list" ? (
        <FormGroup className={"d-inline-flex"}>
          {buttonCalendar()}
          {buttonToday()}
          {buttonRefresh()}
        </FormGroup>
      ) : part === "food" && type === "detail" ? (
        <FormGroup className={"d-inline-flex"}>
          {buttonUpdate()}
          {buttonList()}
          {buttonRefresh()}
        </FormGroup>
      ) : part === "food" && type === "save" ? (
        <FormGroup className={"d-inline-flex"}>
          {buttonSave()}
          {buttonSearch()}
          {buttonRefresh()}
        </FormGroup>
      ) : part === "food" && type === "list" ? (
        <FormGroup className={"d-inline-flex"}>
          {buttonCalendar()}
          {buttonToday()}
          {buttonRefresh()}
        </FormGroup>
      ) : part !== "food" && type === "list" ? (
        <FormGroup className={"d-inline-flex"}>
          {buttonCalendar()}
          {buttonToday()}
          {buttonRefresh()}
        </FormGroup>
      ) : part !== "food" && type === "detail" ? (
        <FormGroup className={"d-inline-flex"}>
          {buttonUpdate()}
          {buttonList()}
          {buttonRefresh()}
        </FormGroup>
      ) : part !== "food" && type === "save" ? (
        <FormGroup className={"d-inline-flex"}>
          {buttonSave()}
          {buttonList()}
          {buttonRefresh()}
        </FormGroup>
      ) : part !== "food" && type === "list" ? (
        <FormGroup className={"d-inline-flex"}>
          {buttonCalendar()}
          {buttonToday()}
          {buttonRefresh()}
        </FormGroup>
      ) : null}
    </React.Fragment>
  );
};